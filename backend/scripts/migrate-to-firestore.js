const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { getDatabase, getFirestoreDb } = require('../src/config/connection');

async function migrate() {
  console.log('--- Starting SQLite to Cloud Firestore Migration ---');

  const fdb = getFirestoreDb();
  if (!fdb) {
    console.error('Error: Firestore connection could not be established. Make sure your environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are set.');
    process.exit(1);
  }

  const sdb = getDatabase();

  try {
    console.log('Migrating products...');
    const productsList = sdb.prepare('SELECT * FROM products').all();
    const variantStmt = sdb.prepare('SELECT * FROM product_variants WHERE product_id = ?');

    for (const prod of productsList) {
      const variants = variantStmt.all(prod.id);
      
      let images = [];
      let benefits = [];
      let brewing_instructions = {};
      try {
        images = prod.images ? JSON.parse(prod.images) : [];
        benefits = prod.benefits ? JSON.parse(prod.benefits) : [];
        brewing_instructions = prod.brewing_instructions ? JSON.parse(prod.brewing_instructions) : {};
      } catch (e) {}

      const productPayload = {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        category: prod.category,
        base_price: prod.base_price,
        compare_at_price: prod.compare_at_price,
        image_url: prod.image_url,
        images,
        benefits,
        brewing_instructions,
        is_featured: prod.is_featured,
        is_active: prod.is_active,
        created_at: prod.created_at || new Date().toISOString(),
        updated_at: prod.updated_at || new Date().toISOString(),
        variants: variants.map(v => ({
          id: String(v.id),
          name: v.name,
          sku: v.sku,
          price: v.price,
          compare_at_price: v.compare_at_price,
          stock: v.stock,
          low_stock_threshold: v.low_stock_threshold,
          is_active: v.is_active
        }))
      };

      await fdb.collection('products').doc(prod.slug).set(productPayload);
      console.log(`  ✓ Migrated product: ${prod.slug}`);
    }

    console.log('Migrating coupons...');
    const couponsList = sdb.prepare('SELECT * FROM coupons').all();
    for (const c of couponsList) {
      await fdb.collection('coupons').doc(c.code.toUpperCase()).set({
        code: c.code.toUpperCase(),
        description: c.description,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
        min_order_amount: c.min_order_amount,
        usage_limit: c.usage_limit,
        times_used: c.times_used,
        is_active: c.is_active,
        expires_at: c.expires_at,
        created_at: c.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated coupon: ${c.code}`);
    }

    console.log('Migrating admin users...');
    const adminsList = sdb.prepare('SELECT * FROM admin_users').all();
    for (const a of adminsList) {
      await fdb.collection('admin_users').doc(a.username.toLowerCase()).set({
        username: a.username.toLowerCase(),
        email: a.email,
        password_hash: a.password_hash,
        role: a.role || 'admin',
        created_at: a.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated admin user: ${a.username}`);
    }

    console.log('Migrating customers...');
    const customersList = sdb.prepare('SELECT * FROM customers').all();
    for (const cust of customersList) {
      await fdb.collection('customers').doc(cust.email.toLowerCase()).set({
        name: cust.name,
        email: cust.email.toLowerCase(),
        phone: cust.phone,
        address_line1: cust.address_line1,
        address_line2: cust.address_line2 || '',
        city: cust.city,
        state: cust.state,
        pincode: cust.pincode,
        total_orders: cust.total_orders,
        total_spent: cust.total_spent,
        created_at: cust.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated customer: ${cust.email}`);
    }

    console.log('Migrating orders...');
    const ordersList = sdb.prepare('SELECT * FROM orders').all();
    const itemsStmt = sdb.prepare('SELECT * FROM order_items WHERE order_id = ?');

    for (const order of ordersList) {
      const items = itemsStmt.all(order.id);
      await fdb.collection('orders').doc(order.order_number).set({
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        razorpay_order_id: order.razorpay_order_id,
        razorpay_payment_id: order.razorpay_payment_id,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        discount_amount: order.discount_amount,
        total: order.total,
        coupon_code: order.coupon_code,
        shipping_name: order.shipping_name,
        shipping_email: order.shipping_email,
        shipping_phone: order.shipping_phone,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_pincode: order.shipping_pincode,
        notes: order.notes,
        tracking_id: order.tracking_id,
        shipping_label_url: order.shipping_label_url,
        courier_name: order.courier_name || 'Delhivery',
        created_at: order.created_at || new Date().toISOString(),
        updated_at: order.updated_at || new Date().toISOString(),
        items: items.map(i => ({
          product_id: String(i.product_id),
          variant_id: String(i.variant_id),
          product_name: i.product_name,
          variant_name: i.variant_name,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total_price: i.total_price
        }))
      });
      console.log(`  ✓ Migrated order: ${order.order_number}`);
    }

    console.log('--- Migration completed successfully! ---');
  } catch (err) {
    console.error('Migration failed with error:', err.message);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = { migrate };
