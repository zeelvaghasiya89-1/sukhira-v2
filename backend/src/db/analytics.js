const { getDatabase, getFirestoreDb } = require('../config/connection');

async function getDashboardStats() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const ordersSnapshot = await fdb.collection('orders').where('payment_status', '==', 'paid').get();
      let totalRevenue = 0;
      let todayOrders = 0;
      const todayStr = new Date().toISOString().split('T')[0];

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.total || 0;
        
        const orderDateStr = order.created_at ? order.created_at.split('T')[0] : '';
        if (orderDateStr === todayStr) {
          todayOrders++;
        }
      });

      const custSnapshot = await fdb.collection('customers').where('total_orders', '>', 0).get();
      const activeCustomers = custSnapshot.size;

      const prodSnapshot = await fdb.collection('products').get();
      let lowStockItems = 0;
      prodSnapshot.forEach(doc => {
        const prod = doc.data();
        if (prod.variants) {
          prod.variants.forEach(v => {
            const threshold = v.low_stock_threshold !== undefined ? v.low_stock_threshold : 10;
            if (v.is_active === 1 && v.stock <= threshold) {
              lowStockItems++;
            }
          });
        }
      });

      return {
        totalRevenue,
        todayOrders,
        activeCustomers,
        lowStockItems
      };
    } catch (err) {
      console.error('Firestore getDashboardStats error:', err.message);
      return { totalRevenue: 0, todayOrders: 0, activeCustomers: 0, lowStockItems: 0 };
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const totalRevenue = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as value 
    FROM orders 
    WHERE payment_status = 'paid'
  `).get().value;

  const todayOrders = db.prepare(`
    SELECT COUNT(*) as value 
    FROM orders 
    WHERE date(created_at) = date('now')
  `).get().value;

  const activeCustomers = db.prepare(`
    SELECT COUNT(*) as value 
    FROM customers 
    WHERE total_orders > 0
  `).get().value;

  const lowStockItems = db.prepare(`
    SELECT COUNT(*) as value 
    FROM product_variants 
    WHERE stock <= low_stock_threshold AND is_active = 1
  `).get().value;

  return {
    totalRevenue,
    todayOrders,
    activeCustomers,
    lowStockItems
  };
}

async function getSalesChartData(days = 30) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const ordersSnapshot = await fdb.collection('orders').where('payment_status', '==', 'paid').get();
      
      const chartDataMap = {};
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        chartDataMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
      }

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const dateStr = order.created_at ? order.created_at.split('T')[0] : '';
        if (chartDataMap[dateStr]) {
          chartDataMap[dateStr].revenue += order.total || 0;
          chartDataMap[dateStr].orders += 1;
        }
      });

      return Object.values(chartDataMap).sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      console.error('Firestore getSalesChartData error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const query = `
    WITH RECURSIVE dates(d) AS (
      VALUES(date('now', ?))
      UNION ALL
      SELECT date(d, '+1 day') FROM dates WHERE d < date('now')
    )
    SELECT 
      dates.d as date,
      COALESCE(SUM(o.total), 0) as revenue,
      COUNT(o.id) as orders
    FROM dates
    LEFT JOIN orders o ON date(o.created_at) = dates.d AND o.payment_status = 'paid'
    GROUP BY dates.d
    ORDER BY dates.d ASC
  `;
  const startOffset = `-${days - 1} days`;
  return db.prepare(query).all(startOffset);
}

async function getTopProducts(limit = 5) {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const ordersSnapshot = await fdb.collection('orders').where('payment_status', '==', 'paid').get();
      const productSales = {};

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        if (order.items) {
          order.items.forEach(item => {
            const key = item.product_id || item.product_name;
            if (!productSales[key]) {
              productSales[key] = {
                product_name: item.product_name,
                units_sold: 0,
                revenue: 0
              };
            }
            productSales[key].units_sold += item.quantity || 0;
            productSales[key].revenue += item.total_price || 0;
          });
        }
      });

      return Object.values(productSales)
        .sort((a, b) => b.units_sold - a.units_sold)
        .slice(0, limit);
    } catch (err) {
      console.error('Firestore getTopProducts error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const query = `
    SELECT 
      oi.product_name,
      SUM(oi.quantity) as units_sold,
      SUM(oi.total_price) as revenue
    FROM order_items oi
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE o.payment_status = 'paid'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY units_sold DESC
    LIMIT ?
  `;
  return db.prepare(query).all(limit);
}

async function getLowStockAlerts() {
  const fdb = getFirestoreDb();
  if (fdb) {
    try {
      const prodSnapshot = await fdb.collection('products').get();
      const alerts = [];

      prodSnapshot.forEach(doc => {
        const prod = doc.data();
        if (prod.variants) {
          prod.variants.forEach(v => {
            const threshold = v.low_stock_threshold !== undefined ? v.low_stock_threshold : 10;
            if (v.is_active === 1 && v.stock <= threshold) {
              alerts.push({
                product_name: prod.name,
                variant_name: v.name,
                sku: v.sku,
                stock: v.stock,
                low_stock_threshold: threshold
              });
            }
          });
        }
      });

      return alerts.sort((a, b) => a.stock - b.stock);
    } catch (err) {
      console.error('Firestore getLowStockAlerts error:', err.message);
      return [];
    }
  }

  // SQLite Fallback
  const db = getDatabase();
  const query = `
    SELECT 
      p.name as product_name,
      pv.name as variant_name,
      pv.sku,
      pv.stock,
      pv.low_stock_threshold
    FROM product_variants pv
    INNER JOIN products p ON pv.product_id = p.id
    WHERE pv.stock <= pv.low_stock_threshold AND pv.is_active = 1
    ORDER BY pv.stock ASC
  `;
  return db.prepare(query).all();
}

module.exports = {
  getDashboardStats,
  getSalesChartData,
  getTopProducts,
  getLowStockAlerts
};
