const { getDatabase, getFirestoreDb } = require('../config/connection');

async function getAllCoupons() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('coupons').orderBy('created_at', 'desc').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id });
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllCoupons error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC');
  return stmt.all();
}

async function getCouponByCode(code) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('coupons').doc(code.toUpperCase());
      const doc = await docRef.get();
      if (doc.exists) {
        const coupon = doc.data();
        if (coupon.is_active === 1) {
          return { ...coupon, id: doc.id };
        }
      }
      return null;
    } catch (err) {
      console.error('Firestore getCouponByCode error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1');
  return stmt.get(code);
}

async function createCoupon(couponData) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const code = couponData.code.toUpperCase();
      const docRef = fdb.collection('coupons').doc(code);
      
      const payload = {
        ...couponData,
        code,
        id: Date.now(),
        times_used: 0,
        created_at: new Date().toISOString()
      };
      
      await docRef.set(payload);
      return { lastInsertRowid: code };
    } catch (err) {
      console.error('Firestore createCoupon error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active, expires_at)
    VALUES (@code, @description, @discount_type, @discount_value, @min_order_amount, @usage_limit, @is_active, @expires_at)
  `);

  const payload = {
    code: couponData.code ? couponData.code.toUpperCase() : '',
    description: couponData.description || '',
    discount_type: couponData.discount_type || 'percentage',
    discount_value: parseFloat(couponData.discount_value) || 0,
    min_order_amount: parseFloat(couponData.min_order_amount) || 0,
    usage_limit: couponData.usage_limit ? parseInt(couponData.usage_limit) : null,
    is_active: couponData.is_active !== undefined ? parseInt(couponData.is_active) : 1,
    expires_at: couponData.expires_at || null
  };

  return stmt.run(payload);
}

async function updateCoupon(id, couponData) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('coupons').doc(String(id));
      await docRef.update(couponData);
      return true;
    } catch (err) {
      console.error('Firestore updateCoupon error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE coupons 
    SET code = @code, description = @description, discount_type = @discount_type, 
        discount_value = @discount_value, min_order_amount = @min_order_amount, 
        usage_limit = @usage_limit, is_active = @is_active, expires_at = @expires_at
    WHERE id = @id
  `);

  const payload = {
    id,
    code: couponData.code ? couponData.code.toUpperCase() : '',
    description: couponData.description || '',
    discount_type: couponData.discount_type || 'percentage',
    discount_value: parseFloat(couponData.discount_value) || 0,
    min_order_amount: parseFloat(couponData.min_order_amount) || 0,
    usage_limit: couponData.usage_limit ? parseInt(couponData.usage_limit) : null,
    is_active: couponData.is_active !== undefined ? parseInt(couponData.is_active) : 1,
    expires_at: couponData.expires_at || null
  };

  return stmt.run(payload);
}

async function deleteCoupon(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('coupons').doc(String(id));
      await docRef.delete();
      return true;
    } catch (err) {
      console.error('Firestore deleteCoupon error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM coupons WHERE id = ?');
  return stmt.run(id);
}

module.exports = {
  getAllCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
