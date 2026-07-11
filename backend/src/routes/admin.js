const express = require('express');
const router = express.Router();
const { SignJWT, jwtVerify } = require('jose');
const bcrypt = require('bcryptjs');

const adminDb = require('../db/admin');
const productsDb = require('../db/products');
const ordersDb = require('../db/orders');
const customersDb = require('../db/customers');
const couponsDb = require('../db/coupons');
const inboxDb = require('../db/inbox');
const analyticsDb = require('../db/analytics');

const delhivery = require('../services/delhivery');
const r2 = require('../services/r2');

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-Sukhira-JWT-Secret'
);

// 🔐 Authentication Middleware
async function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid session' });
  }
}

// ----------------------------------------------------
// 🔐 Authentication Routes
// ----------------------------------------------------

// 1. POST /auth/login - Admin Login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await adminDb.getAdminByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      path: '/'
    });

    res.json({ success: true, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. POST /auth/logout - Admin Logout
router.post('/auth/logout', (req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ success: true });
});

// 3. GET /auth/me - Verify session
router.get('/auth/me', requireAdminAuth, (req, res) => {
  res.json({ user: req.admin });
});

// 4. POST /auth/change-password
router.post('/auth/change-password', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const user = await adminDb.getAdminByUsername(req.admin.username);
    if (!user) return res.status(404).json({ error: 'Admin user not found.' });

    const isValid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isValid) return res.status(400).json({ error: 'Incorrect current password.' });

    const hash = bcrypt.hashSync(newPassword, 10);
    await adminDb.updateAdminPassword(user.username, hash);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 📊 Dashboard / Analytics Routes
// ----------------------------------------------------
router.get('/dashboard', requireAdminAuth, async (req, res) => {
  try {
    const stats = await analyticsDb.getDashboardStats();
    const chart = await analyticsDb.getSalesChartData(30);
    const topProducts = await analyticsDb.getTopProducts(5);
    const alerts = await analyticsDb.getLowStockAlerts();

    res.json({ stats, chart, topProducts, alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 🏷️ Coupon Management Routes
// ----------------------------------------------------
router.get('/coupons', requireAdminAuth, async (req, res) => {
  try {
    const list = await couponsDb.getAllCoupons();
    res.json({ coupons: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/coupons', requireAdminAuth, async (req, res) => {
  try {
    await couponsDb.createCoupon(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/coupons/:id', requireAdminAuth, async (req, res) => {
  try {
    await couponsDb.updateCoupon(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/coupons/:id', requireAdminAuth, async (req, res) => {
  try {
    await couponsDb.deleteCoupon(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 🌿 Product Catalog Routes
// ----------------------------------------------------
router.get('/products', requireAdminAuth, async (req, res) => {
  try {
    const list = await productsDb.getAllProducts(true);
    res.json({ products: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const prod = await productsDb.getProductById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: prod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', requireAdminAuth, async (req, res) => {
  try {
    const { name, slug, description, category, base_price, compare_at_price, image_url, images, benefits, brewing_instructions, is_featured, is_active, variants } = req.body;
    
    const productPayload = {
      name,
      slug,
      description,
      category,
      base_price: parseFloat(base_price),
      compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
      image_url,
      images: images || [],
      benefits: benefits || [],
      brewing_instructions: brewing_instructions || {},
      is_featured: is_featured ? 1 : 0,
      is_active: is_active ? 1 : 0
    };

    await productsDb.createProduct(productPayload, variants || []);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const { name, slug, description, category, base_price, compare_at_price, image_url, images, benefits, brewing_instructions, is_featured, is_active, variants } = req.body;
    
    const productPayload = {
      name,
      slug,
      description,
      category,
      base_price: parseFloat(base_price),
      compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
      image_url,
      images: images || [],
      benefits: benefits || [],
      brewing_instructions: brewing_instructions || {},
      is_featured: is_featured ? 1 : 0,
      is_active: is_active ? 1 : 0
    };

    await productsDb.updateProduct(req.params.id, productPayload, variants || []);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 📦 Order Fulfillment Routes
// ----------------------------------------------------
router.get('/orders', requireAdminAuth, async (req, res) => {
  try {
    const list = await ordersDb.getAllOrders();
    res.json({ orders: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', requireAdminAuth, async (req, res) => {
  try {
    const order = await ordersDb.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT / CANCEL ORDER STATUS
router.put('/orders/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const ok = await ordersDb.updateOrderStatus(req.params.id, status);
    if (!ok) return res.status(404).json({ error: 'Order not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SHIP ORDER - INTEGRATE DELHIVERY
router.post('/orders/:id/ship', requireAdminAuth, async (req, res) => {
  try {
    const order = await ordersDb.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (order.tracking_id) {
      return res.status(400).json({ error: 'Order has already been shipped.' });
    }

    const shipResult = await delhivery.createShipment(order);
    if (shipResult.success) {
      await ordersDb.updateOrderShippingInfo(req.params.id, shipResult.waybill, shipResult.label_url);
      res.json({ success: true, tracking_id: shipResult.waybill, label_url: shipResult.label_url });
    } else {
      res.status(400).json({ error: shipResult.error || 'Failed to register shipment.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELHIVERY MOCK BARCODE PDF PRINTER
router.get('/orders/:id/label-preview', async (req, res) => {
  try {
    const order = await ordersDb.getOrderById(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <title>Delhivery Packing Slip - ${order.order_number}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 400px; border: 2px solid #000; margin: auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .barcode { background: repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 8px); height: 60px; margin: 15px 0; }
            .details { font-size: 12px; line-height: 1.6; }
            .center { text-align: center; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h3>DELHIVERY SHIPPING</h3>
            <p>WAYBILL: <b>${order.tracking_id || 'PENDING'}</b></p>
          </div>
          <div class="barcode"></div>
          <div class="details">
            <p><b>TO:</b> ${order.shipping_name}</p>
            <p><b>ADD:</b> ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} - ${order.shipping_pincode}</p>
            <p><b>PHONE:</b> ${order.shipping_phone}</p>
            <p><b>ORDER REF:</b> ${order.order_number}</p>
            <p><b>COURIER:</b> Delhivery (Surface)</p>
          </div>
          <div class="center" style="margin-top:20px; font-size:10px;">
            <p>Fulfillment partner: Sukhira Wellness</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ----------------------------------------------------
// 👥 Customer Profiles Routes
// ----------------------------------------------------
router.get('/customers', requireAdminAuth, async (req, res) => {
  try {
    const list = await customersDb.getAllCustomers();
    res.json({ customers: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customers/:id', requireAdminAuth, async (req, res) => {
  try {
    const customer = await customersDb.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 📥 Inbox & Messaging Routes
// ----------------------------------------------------
router.get('/inbox', requireAdminAuth, async (req, res) => {
  try {
    const list = await inboxDb.getAllMessages();
    res.json({ messages: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/inbox/:id', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await inboxDb.updateMessageStatus(req.params.id, status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/inbox/:id', requireAdminAuth, async (req, res) => {
  try {
    await inboxDb.deleteMessage(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/inbox', requireAdminAuth, async (req, res) => {
  try {
    const { action, id, status } = req.body;
    if (action === 'updateStatus') {
      await inboxDb.updateMessageStatus(id, status);
      return res.json({ success: true });
    }
    if (action === 'delete') {
      await inboxDb.deleteMessage(id);
      return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid action payload.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribers
router.get('/subscribers', requireAdminAuth, async (req, res) => {
  try {
    const list = await inboxDb.getAllSubscribers();
    res.json({ subscribers: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/subscribers/:id', requireAdminAuth, async (req, res) => {
  try {
    await inboxDb.deleteSubscriber(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscribers', requireAdminAuth, async (req, res) => {
  try {
    const { action, id } = req.body;
    if (action === 'delete') {
      await inboxDb.deleteSubscriber(id);
      return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid action payload.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ☁️ File Uploads Route
// ----------------------------------------------------
router.post('/upload', requireAdminAuth, async (req, res) => {
  try {
    const { file, fileName, fileType } = req.body;
    if (!file || !fileName || !fileType) {
      return res.status(400).json({ error: 'Missing required file data.' });
    }

    const buffer = Buffer.from(file, 'base64');
    const fileUrl = await r2.uploadFileBuffer(buffer, fileName, fileType);
    
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
