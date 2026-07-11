const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');

const productsDb = require('../db/products');
const ordersDb = require('../db/orders');
const couponsDb = require('../db/coupons');
const inboxDb = require('../db/inbox');
const delhivery = require('../services/delhivery');

// Initialize Razorpay SDK helper
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// 1. GET /products - Fetch all active products
router.get('/products', async (req, res) => {
  try {
    const list = await productsDb.getAllProducts(false);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /products/:slug - Retrieve product by slug details
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await productsDb.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /create-order - Create Razorpay order (standard popup checkout)
router.post('/create-order', async (req, res) => {
  try {
    const { amount, couponCode, shippingInfo, items } = req.body;
    if (!amount || !shippingInfo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    const orderNumber = 'SUKH' + Date.now().toString().slice(-8).toUpperCase();
    const rzp = getRazorpayInstance();
    
    let razorpayOrderId = null;
    if (rzp) {
      // Create standard Razorpay Order
      const options = {
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt: orderNumber
      };
      const rzpOrder = await rzp.orders.create(options);
      razorpayOrderId = rzpOrder.id;
    } else {
      // Mock Sandbox Order ID
      razorpayOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9);
      console.log('[Razorpay Sandbox] Created simulated order:', razorpayOrderId);
    }

    // Save order record with pending status
    const newOrder = {
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'pending',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: null,
      subtotal: parseFloat(amount), 
      shipping_cost: 0.0,
      discount_amount: 0.0,
      total: parseFloat(amount),
      coupon_code: couponCode || null,
      shipping_name: shippingInfo.name,
      shipping_email: shippingInfo.email,
      shipping_phone: shippingInfo.phone,
      shipping_address: shippingInfo.address,
      shipping_city: shippingInfo.city,
      shipping_state: shippingInfo.state,
      shipping_pincode: shippingInfo.pincode,
      notes: shippingInfo.notes || '',
      courier_name: 'Delhivery'
    };

    await ordersDb.createOrder(newOrder, items);

    res.json({
      success: true,
      orderNumber,
      razorpayOrderId,
      amount: newOrder.total,
      currency: 'INR'
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /verify-payment - Cryptographic payment verification (standard order signatures)
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment signature verification parameters.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && razorpay_signature && razorpay_signature !== 'mock_sig') {
      // Live HMAC Verify (computes order_id + | + payment_id)
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Payment signature validation failed.' });
      }
    } else {
      console.log('[Razorpay Sandbox] Bypassing HMAC verification in offline simulation.');
    }

    // Update order database record status
    const verified = await ordersDb.confirmOrderPayment(razorpay_order_id, razorpay_payment_id);
    if (!verified) {
      return res.status(404).json({ success: false, error: 'Corresponding order record not found.' });
    }

    const order = await ordersDb.getOrderByRazorpayOrderId(razorpay_order_id);
    res.json({ success: true, orderNumber: order ? order.order_number : null });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /apply-coupon - Match coupon discounts
router.post('/apply-coupon', async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required.' });

    const coupon = await couponsDb.getCouponByCode(code.toUpperCase());
    if (!coupon) return res.status(404).json({ error: 'Invalid or inactive coupon code.' });

    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount of ₹${coupon.min_order_amount} required for this discount.` });
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ error: 'This coupon usage limit has been exceeded.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This coupon has expired.' });
    }

    res.json({
      success: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. POST /contact - Create support message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    await inboxDb.createMessage({ name, email, subject, message });
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. POST /subscribe - Create subscriber record
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required.' });

    const subscriber = await inboxDb.addSubscriber(email);
    if (!subscriber) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }
    res.json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. GET /track - Tracking query wrapper
router.get('/track', async (req, res) => {
  try {
    const { waybill } = req.query;
    if (!waybill) return res.status(400).json({ error: 'Waybill query parameter is required.' });

    // Look up order matching waybill to pass correct date for simulation logs
    const orders = await ordersDb.getAllOrders();
    const match = orders.find(o => o.tracking_id === waybill);
    const orderDate = match ? match.created_at : new Date().toISOString();

    const data = await delhivery.trackShipment(waybill, orderDate);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Razorpay Magic Checkout API Endpoints (called directly by Razorpay)

// 9a. POST /magic/coupons - Get promotions list
router.post('/magic/coupons', async (req, res) => {
  try {
    const activeCoupons = await couponsDb.getAllCoupons();
    const filtered = activeCoupons.filter(c => c.is_active === 1);
    
    const coupons = filtered.map(c => ({
      code: c.code,
      description: c.description || `${c.discount_value}${c.discount_type === 'percentage' ? '%' : ' INR'} off`,
      minimum_order_value: Math.round((c.min_order_amount || 0) * 100), // convert to paise
      expires_at: c.expires_at ? Math.round(new Date(c.expires_at).getTime() / 1000) : null
    }));

    res.json({ coupons });
  } catch (err) {
    console.error('Magic Checkout Get Coupons error:', err);
    res.json({ coupons: [] }); // return empty list on failure to prevent checkout blocks
  }
});

// 9b. POST /magic/coupons/apply - Validate and apply coupon
router.post('/magic/coupons/apply', async (req, res) => {
  try {
    const { coupon_code, order_amount } = req.body;
    if (!coupon_code) {
      return res.json({ success: false, message: 'Coupon code required' });
    }

    const coupon = await couponsDb.getCouponByCode(coupon_code.toUpperCase());
    if (!coupon) {
      return res.json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    const minAmountPaise = Math.round((coupon.min_order_amount || 0) * 100);
    if (order_amount < minAmountPaise) {
      return res.json({ 
        success: false, 
        message: `Minimum order amount of ₹${coupon.min_order_amount} required.` 
      });
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.json({ success: false, message: 'Coupon usage limit has been exceeded' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.json({ success: false, message: 'This coupon has expired' });
    }

    // Calculate discount amount in paise
    let discountAmountPaise = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmountPaise = Math.round(order_amount * (coupon.discount_value / 100));
    } else {
      discountAmountPaise = Math.round(coupon.discount_value * 100);
    }

    // Caps discount at total order amount
    discountAmountPaise = Math.min(discountAmountPaise, order_amount);

    res.json({
      success: true,
      discount_amount: discountAmountPaise,
      final_amount: order_amount - discountAmountPaise,
      message: 'Coupon applied successfully!'
    });
  } catch (err) {
    console.error('Magic Checkout Apply Coupon error:', err);
    res.json({ success: false, message: 'Internal error checking coupon eligibility' });
  }
});

// 9c. POST /magic/shipping - Calculate dynamic shipping rates
router.post('/magic/shipping', async (req, res) => {
  try {
    const { shipping_address, order_amount } = req.body;
    
    // Convert order amount to INR rupees for threshold comparison
    const orderAmountINR = (order_amount || 0) / 100;
    
    const shippingFreeThreshold = 499;
    const flatShippingRateINR = 50;
    
    const isShippingFree = orderAmountINR >= shippingFreeThreshold;
    const shippingFeePaise = isShippingFree ? 0 : (flatShippingRateINR * 100);

    res.json({
      shipping_serviceable: true,
      cod_serviceable: true,
      shipping_fee: shippingFeePaise,
      cod_fee: 0
    });
  } catch (err) {
    console.error('Magic Checkout Shipping calculate error:', err);
    res.json({
      shipping_serviceable: true, // fallback to serviceable to avoid block
      cod_serviceable: true,
      shipping_fee: 5000, // ₹50 default
      cod_fee: 0
    });
  }
});

module.exports = router;
