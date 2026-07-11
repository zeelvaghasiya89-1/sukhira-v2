const { getDatabase, getFirestoreDb } = require('../config/connection');

async function getAllProducts(includeInactive = false) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      let query = fdb.collection('products').orderBy('created_at', 'desc');
      const snapshot = await query.get();
      const list = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (includeInactive || data.is_active === 1) {
          list.push({ ...data, id: doc.id });
        }
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllProducts error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const query = includeInactive 
    ? 'SELECT * FROM products ORDER BY created_at DESC'
    : 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC';
  
  const stmt = db.prepare(query);
  const productsList = stmt.all();

  const variantStmt = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND (is_active = 1 OR ?)');
  return productsList.map(product => {
    product.variants = variantStmt.all(product.id, includeInactive ? 1 : 0);
    try {
      product.images = product.images ? JSON.parse(product.images) : [];
      product.benefits = product.benefits ? JSON.parse(product.benefits) : [];
      product.brewing_instructions = product.brewing_instructions ? JSON.parse(product.brewing_instructions) : {};
    } catch (e) {
      product.images = [];
      product.benefits = [];
      product.brewing_instructions = {};
    }
    return product;
  });
}

async function getProductBySlug(slug) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('products').where('slug', '==', slug).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { ...doc.data(), id: doc.id };
    } catch (err) {
      console.error('Firestore getProductBySlug error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM products WHERE slug = ?');
  const product = stmt.get(slug);

  if (product) {
    const variantStmt = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1');
    product.variants = variantStmt.all(product.id);
    try {
      product.images = product.images ? JSON.parse(product.images) : [];
      product.benefits = product.benefits ? JSON.parse(product.benefits) : [];
      product.brewing_instructions = product.brewing_instructions ? JSON.parse(product.brewing_instructions) : {};
    } catch (e) {
      product.images = [];
      product.benefits = [];
      product.brewing_instructions = {};
    }
  }
  return product;
}

async function getProductById(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('products').doc(String(id));
      const doc = await docRef.get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
      
      const snapshot = await fdb.collection('products').where('id', '==', parseInt(id)).limit(1).get();
      if (!snapshot.empty) {
        return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
      }
      return null;
    } catch (err) {
      console.error('Firestore getProductById error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const product = stmt.get(id);

  if (product) {
    const variantStmt = db.prepare('SELECT * FROM product_variants WHERE product_id = ?');
    product.variants = variantStmt.all(product.id);
    try {
      product.images = product.images ? JSON.parse(product.images) : [];
      product.benefits = product.benefits ? JSON.parse(product.benefits) : [];
      product.brewing_instructions = product.brewing_instructions ? JSON.parse(product.brewing_instructions) : {};
    } catch (e) {
      product.images = [];
      product.benefits = [];
      product.brewing_instructions = {};
    }
  }
  return product;
}

async function createProduct(productData, variants = []) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const slug = productData.slug;
      const docRef = fdb.collection('products').doc(slug);
      
      const payload = {
        ...productData,
        id: Date.now(),
        variants: variants.map((v, i) => ({
          ...v,
          id: v.id || `${slug}_v_${i}`,
          stock: parseInt(v.stock) || 0,
          price: parseFloat(v.price) || 0,
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          is_active: v.is_active !== undefined ? v.is_active : 1
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await docRef.set(payload);
      return slug;
    } catch (err) {
      console.error('Firestore createProduct error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const insertProduct = db.transaction((prod, vars) => {
    const pStmt = db.prepare(`
      INSERT INTO products (name, slug, description, category, base_price, compare_at_price, image_url, images, benefits, brewing_instructions, is_featured, is_active)
      VALUES (@name, @slug, @description, @category, @base_price, @compare_at_price, @image_url, @images, @benefits, @brewing_instructions, @is_featured, @is_active)
    `);
    
    const formattedProd = {
      ...prod,
      images: JSON.stringify(prod.images || []),
      benefits: JSON.stringify(prod.benefits || []),
      brewing_instructions: JSON.stringify(prod.brewing_instructions || {})
    };

    const result = pStmt.run(formattedProd);
    const productId = result.lastInsertRowid;

    const vStmt = db.prepare(`
      INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, low_stock_threshold, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const v of vars) {
      vStmt.run(productId, v.name, v.sku, v.price, v.compare_at_price || null, v.stock || 0, v.low_stock_threshold || 10, v.is_active !== undefined ? v.is_active : 1);
    }

    return productId;
  });

  return insertProduct(productData, variants);
}

async function updateProduct(id, productData, variants = []) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('products').doc(String(id));
      const doc = await docRef.get();
      
      const payload = {
        ...productData,
        variants: variants.map((v, i) => ({
          ...v,
          id: v.id || `${id}_v_${i}`,
          stock: parseInt(v.stock) || 0,
          price: parseFloat(v.price) || 0,
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          is_active: v.is_active !== undefined ? v.is_active : 1
        })),
        updated_at: new Date().toISOString()
      };
      
      if (doc.exists) {
        await docRef.update(payload);
      } else {
        await docRef.set(payload);
      }
      return true;
    } catch (err) {
      console.error('Firestore updateProduct error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const updateProductTx = db.transaction((prodId, prod, vars) => {
    const pStmt = db.prepare(`
      UPDATE products 
      SET name = @name, slug = @slug, description = @description, category = @category, 
          base_price = @base_price, compare_at_price = @compare_at_price, image_url = @image_url, 
          images = @images, benefits = @benefits, brewing_instructions = @brewing_instructions, 
          is_featured = @is_featured, is_active = @is_active, updated_at = datetime('now')
      WHERE id = @id
    `);

    const formattedProd = {
      ...prod,
      id: prodId,
      images: JSON.stringify(prod.images || []),
      benefits: JSON.stringify(prod.benefits || []),
      brewing_instructions: JSON.stringify(prod.brewing_instructions || {})
    };

    pStmt.run(formattedProd);

    const existingVariants = db.prepare('SELECT id FROM product_variants WHERE product_id = ?').all(prodId).map(v => v.id);
    const updatedIds = vars.filter(v => v.id).map(v => v.id);
    
    const deleteStmt = db.prepare('DELETE FROM product_variants WHERE id = ?');
    for (const vId of existingVariants) {
      if (!updatedIds.includes(vId)) {
        deleteStmt.run(vId);
      }
    }

    const insertStmt = db.prepare(`
      INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, stock, low_stock_threshold, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStmt = db.prepare(`
      UPDATE product_variants 
      SET name = ?, sku = ?, price = ?, compare_at_price = ?, stock = ?, low_stock_threshold = ?, is_active = ?
      WHERE id = ?
    `);

    for (const v of vars) {
      if (v.id) {
        updateStmt.run(v.name, v.sku, v.price, v.compare_at_price || null, v.stock, v.low_stock_threshold || 10, v.is_active !== undefined ? v.is_active : 1, v.id);
      } else {
        insertStmt.run(prodId, v.name, v.sku, v.price, v.compare_at_price || null, v.stock, v.low_stock_threshold || 10, v.is_active !== undefined ? v.is_active : 1);
      }
    }
  });

  updateProductTx(id, productData, variants);
  return true;
}

async function updateStock(variantId, quantityChange) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('products').get();
      for (const doc of snapshot.docs) {
        const product = doc.data();
        let matched = false;
        const updatedVariants = product.variants.map(v => {
          if (String(v.id) === String(variantId)) {
            matched = true;
            return { ...v, stock: Math.max(0, v.stock + quantityChange) };
          }
          return v;
        });

        if (matched) {
          await doc.ref.update({ variants: updatedVariants });
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Firestore updateStock error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?');
  return stmt.run(quantityChange, variantId);
}

module.exports = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  updateStock
};
