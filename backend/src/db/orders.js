const { getDatabase, getFirestoreDb } = require('../config/connection');
const products = require('./products');

async function getAllOrders() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('orders').orderBy('created_at', 'desc').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id });
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllOrders error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  return stmt.all();
}

async function getOrderById(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('orders').doc(String(id));
      let doc = await docRef.get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
      const snapshot = await fdb.collection('orders').where('id', '==', parseInt(id)).limit(1).get();
      if (!snapshot.empty) {
        return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
      }
      return null;
    } catch (err) {
      console.error('Firestore getOrderById error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  const order = stmt.get(id);

  if (order) {
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    order.items = itemsStmt.all(order.id);
  }
  return order;
}

async function getOrderByNumber(orderNumber) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('orders').doc(orderNumber);
      const doc = await docRef.get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
      return null;
    } catch (err) {
      console.error('Firestore getOrderByNumber error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders WHERE order_number = ?');
  const order = stmt.get(orderNumber);

  if (order) {
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    order.items = itemsStmt.all(order.id);
  }
  return order;
}

async function getOrderByRazorpayOrderId(razorpayOrderId) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('orders').where('razorpay_order_id', '==', razorpayOrderId).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { ...doc.data(), id: doc.id };
    } catch (err) {
      console.error('Firestore getOrderByRazorpayOrderId error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM orders WHERE razorpay_order_id = ?');
  const order = stmt.get(razorpayOrderId);

  if (order) {
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    order.items = itemsStmt.all(order.id);
  }
  return order;
}

async function createOrder(orderData, items = []) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const email = orderData.shipping_email.toLowerCase();
      const customerRef = fdb.collection('customers').doc(email);
      const custDoc = await customerRef.get();
      
      const customerData = {
        name: orderData.shipping_name,
        email,
        phone: orderData.shipping_phone,
        address_line1: orderData.shipping_address,
        city: orderData.shipping_city,
        state: orderData.shipping_state,
        pincode: orderData.shipping_pincode
      };

      if (custDoc.exists) {
        await customerRef.update(customerData);
      } else {
        await customerRef.set({
          ...customerData,
          id: `cust_${Date.now()}`,
          total_orders: 0,
          total_spent: 0.0,
          created_at: new Date().toISOString()
        });
      }

      const orderNumber = orderData.order_number;
      const orderRef = fdb.collection('orders').doc(orderNumber);
      
      const payload = {
        ...orderData,
        id: Date.now(),
        items: items.map(item => ({
          ...item,
          total_price: parseFloat(item.total_price) || 0,
          unit_price: parseFloat(item.unit_price) || 0,
          quantity: parseInt(item.quantity) || 1
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await orderRef.set(payload);
      return orderNumber;
    } catch (err) {
      console.error('Firestore createOrder error:', err.message);
      throw err;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const insertOrderTx = db.transaction((order, lineItems) => {
    const custStmt = db.prepare('SELECT id FROM customers WHERE email = ?');
    let customer = custStmt.get(order.shipping_email);
    let customerId = null;

    if (customer) {
      customerId = customer.id;
      db.prepare(`
        UPDATE customers 
        SET name = ?, phone = ?, address_line1 = ?, city = ?, state = ?, pincode = ?
        WHERE id = ?
      `).run(order.shipping_name, order.shipping_phone, order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_pincode, customerId);
    } else {
      const createCust = db.prepare(`
        INSERT INTO customers (name, email, phone, address_line1, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(order.shipping_name, order.shipping_email, order.shipping_phone, order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_pincode);
      customerId = createCust.lastInsertRowid;
    }

    const oStmt = db.prepare(`
      INSERT INTO orders (
        order_number, customer_id, status, payment_status, razorpay_order_id, 
        subtotal, shipping_cost, discount_amount, total, coupon_code,
        shipping_name, shipping_email, shipping_phone, shipping_address, 
        shipping_city, shipping_state, shipping_pincode, notes, courier_name
      ) VALUES (
        @order_number, @customer_id, @status, @payment_status, @razorpay_order_id,
        @subtotal, @shipping_cost, @discount_amount, @total, @coupon_code,
        @shipping_name, @shipping_email, @shipping_phone, @shipping_address,
        @shipping_city, @shipping_state, @shipping_pincode, @notes, @courier_name
      )
    `);

    const result = oStmt.run({
      ...order,
      customer_id: customerId,
      courier_name: order.courier_name || 'Delhivery'
    });
    const orderId = result.lastInsertRowid;

    const itemStmt = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, variant_id, product_name, variant_name, 
        quantity, unit_price, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of lineItems) {
      itemStmt.run(
        orderId, 
        item.product_id, 
        item.variant_id, 
        item.product_name, 
        item.variant_name, 
        item.quantity, 
        item.unit_price, 
        item.total_price
      );
    }

    return orderId;
  });

  return insertOrderTx(orderData, items);
}

async function updateOrderStatus(id, status) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('orders').doc(String(id));
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({ status, updated_at: new Date().toISOString() });
        return true;
      }
      
      const snapshot = await fdb.collection('orders').where('id', '==', parseInt(id)).limit(1).get();
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({ status, updated_at: new Date().toISOString() });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firestore updateOrderStatus error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = datetime(\'now\') WHERE id = ?');
  return stmt.run(status, id);
}

async function confirmOrderPayment(razorpayOrderId, razorpayPaymentId, verifiedShippingDetails = null) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const orderSnapshot = await fdb.collection('orders').where('razorpay_order_id', '==', razorpayOrderId).limit(1).get();
      if (orderSnapshot.empty) return false;
      const orderDoc = orderSnapshot.docs[0];
      const order = orderDoc.data();

      const updatePayload = {
        status: 'confirmed',
        payment_status: 'paid',
        razorpay_payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString()
      };

      if (verifiedShippingDetails) {
        updatePayload.shipping_name = verifiedShippingDetails.name;
        updatePayload.shipping_email = verifiedShippingDetails.email;
        updatePayload.shipping_phone = verifiedShippingDetails.phone;
        updatePayload.shipping_address = verifiedShippingDetails.address;
        updatePayload.shipping_city = verifiedShippingDetails.city;
        updatePayload.shipping_state = verifiedShippingDetails.state;
        updatePayload.shipping_pincode = verifiedShippingDetails.pincode;
      }

      await orderDoc.ref.update(updatePayload);

      const customerEmail = (verifiedShippingDetails ? verifiedShippingDetails.email : order.shipping_email).toLowerCase();
      const customerRef = fdb.collection('customers').doc(customerEmail);
      const custDoc = await customerRef.get();
      
      const newTotalSpent = (order.total || 0);

      if (custDoc.exists) {
        const custData = custDoc.data();
        await customerRef.update({
          total_orders: (custData.total_orders || 0) + 1,
          total_spent: (custData.total_spent || 0) + newTotalSpent
        });
      } else {
        await customerRef.set({
          id: `cust_${Date.now()}`,
          name: verifiedShippingDetails ? verifiedShippingDetails.name : order.shipping_name,
          email: customerEmail,
          phone: verifiedShippingDetails ? verifiedShippingDetails.phone : order.shipping_phone,
          address_line1: verifiedShippingDetails ? verifiedShippingDetails.address : order.shipping_address,
          city: verifiedShippingDetails ? verifiedShippingDetails.city : order.shipping_city,
          state: verifiedShippingDetails ? verifiedShippingDetails.state : order.shipping_state,
          pincode: verifiedShippingDetails ? verifiedShippingDetails.pincode : order.shipping_pincode,
          total_orders: 1,
          total_spent: newTotalSpent,
          created_at: new Date().toISOString()
        });
      }

      if (order.coupon_code) {
        const couponRef = fdb.collection('coupons').doc(order.coupon_code.toUpperCase());
        const couponDoc = await couponRef.get();
        if (couponDoc.exists) {
          const coupon = couponDoc.data();
          await couponRef.update({
            times_used: (coupon.times_used || 0) + 1
          });
        }
      }

      if (order.items) {
        for (const item of order.items) {
          if (item.variant_id) {
            await products.updateStock(item.variant_id, -item.quantity);
          }
        }
      }

      return true;
    } catch (err) {
      console.error('Firestore confirmOrderPayment error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const confirmTx = db.transaction((rzpOrderId, rzpPayId, shipping) => {
    const order = db.prepare('SELECT * FROM orders WHERE razorpay_order_id = ?').get(rzpOrderId);
    if (!order) return false;

    if (shipping) {
      db.prepare(`
        UPDATE orders 
        SET status = 'confirmed', payment_status = 'paid', razorpay_payment_id = ?, 
            shipping_name = ?, shipping_email = ?, shipping_phone = ?, 
            shipping_address = ?, shipping_city = ?, shipping_state = ?, shipping_pincode = ?,
            updated_at = datetime('now') 
        WHERE id = ?
      `).run(rzpPayId, shipping.name, shipping.email, shipping.phone, shipping.address, shipping.city, shipping.state, shipping.pincode, order.id);
      
      // Insert/update customer profile
      const custStmt = db.prepare('SELECT id FROM customers WHERE email = ?');
      let customer = custStmt.get(shipping.email);
      if (customer) {
        db.prepare(`
          UPDATE customers 
          SET name = ?, phone = ?, address_line1 = ?, city = ?, state = ?, pincode = ?, 
              total_orders = total_orders + 1, total_spent = total_spent + ?
          WHERE id = ?
        `).run(shipping.name, shipping.phone, shipping.address, shipping.city, shipping.state, shipping.pincode, order.total, customer.id);
      } else {
        db.prepare(`
          INSERT INTO customers (name, email, phone, address_line1, city, state, pincode, total_orders, total_spent)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).run(shipping.name, shipping.email, shipping.phone, shipping.address, shipping.city, shipping.state, shipping.pincode, order.total);
      }
    } else {
      db.prepare(`
        UPDATE orders 
        SET status = 'confirmed', payment_status = 'paid', razorpay_payment_id = ?, updated_at = datetime('now') 
        WHERE id = ?
      `).run(rzpPayId, order.id);

      db.prepare(`
        UPDATE customers 
        SET total_orders = total_orders + 1, total_spent = total_spent + ?
        WHERE id = ?
      `).run(order.total, order.customer_id);
    }

    if (order.coupon_code) {
      db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE code = ?').run(order.coupon_code);
    }

    const items = db.prepare('SELECT variant_id, quantity FROM order_items WHERE order_id = ?').all(order.id);
    const decStockStmt = db.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ?');
    for (const item of items) {
      if (item.variant_id) {
        decStockStmt.run(item.quantity, item.variant_id);
      }
    }

    return true;
  });

  return confirmTx(razorpayOrderId, razorpayPaymentId, verifiedShippingDetails);
}

async function updateOrderShippingInfo(id, trackingId, labelUrl) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const docRef = fdb.collection('orders').doc(String(id));
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({
          tracking_id: trackingId,
          shipping_label_url: labelUrl,
          status: 'shipped',
          updated_at: new Date().toISOString()
        });
        return true;
      }
      
      const snapshot = await fdb.collection('orders').where('id', '==', parseInt(id)).limit(1).get();
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({
          tracking_id: trackingId,
          shipping_label_url: labelUrl,
          status: 'shipped',
          updated_at: new Date().toISOString()
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firestore updateOrderShippingInfo error:', err.message);
      return false;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE orders 
    SET tracking_id = ?, shipping_label_url = ?, status = 'shipped', updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(trackingId, labelUrl, id);
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getOrderByRazorpayOrderId,
  createOrder,
  updateOrderStatus,
  confirmOrderPayment,
  updateOrderShippingInfo
};
