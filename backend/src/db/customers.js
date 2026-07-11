const { getDatabase, getFirestoreDb } = require('../config/connection');

async function getAllCustomers() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const snapshot = await fdb.collection('customers').orderBy('total_spent', 'desc').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id });
      });
      return list;
    } catch (err) {
      console.error('Firestore getAllCustomers error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM customers ORDER BY total_spent DESC');
  return stmt.all();
}

async function getCustomerById(id) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      let docRef = fdb.collection('customers').doc(String(id));
      let doc = await docRef.get();
      
      if (!doc.exists) {
        const snapshot = await fdb.collection('customers').where('id', '==', String(id)).limit(1).get();
        if (!snapshot.empty) {
          doc = snapshot.docs[0];
        } else {
          return null;
        }
      }
      
      const customer = { ...doc.data(), id: doc.id };
      const ordersSnapshot = await fdb.collection('orders')
        .where('shipping_email', '==', customer.email)
        .get();
        
      const customerOrders = [];
      ordersSnapshot.forEach(orderDoc => {
        customerOrders.push({ ...orderDoc.data(), id: orderDoc.id });
      });
      
      customer.orders = customerOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return customer;
    } catch (err) {
      console.error('Firestore getCustomerById error:', err.message);
      return null;
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
  const customer = stmt.get(id);
  
  if (customer) {
    const ordersStmt = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC');
    customer.orders = ordersStmt.all(customer.id);
  }
  return customer;
}

module.exports = {
  getAllCustomers,
  getCustomerById
};
