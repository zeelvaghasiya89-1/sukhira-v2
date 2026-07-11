"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getSubtotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const subtotal = getSubtotal();
  const shippingCost = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;

    try {
      const res = await fetch('/api/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: subtotal })
      });
      const data = await res.json();
      if (res.ok) {
        let discount = 0;
        if (data.discount_type === 'percentage') {
          discount = subtotal * (data.discount_value / 100);
        } else {
          discount = data.discount_value;
        }
        setDiscountAmount(discount);
        setActiveCoupon(data);
      } else {
        setCouponError(data.error || 'Invalid coupon code.');
      }
    } catch (err) {
      console.error(err);
      setCouponError('Failed to apply coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1. Create order on the server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          shippingInfo: form,
          couponCode: activeCoupon ? activeCoupon.code : null,
          items: cart
        })
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { razorpayOrderId, orderNumber } = orderData;

      // 2. Setup Razorpay Popup Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_zSukhiraKeyDummy', // Fallback
        amount: Math.round(total * 100), // paise
        currency: 'INR',
        name: 'Sukhira Wellness',
        description: 'Premium Tea Blend Order',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify Payment Signature on backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-confirmation?orderNumber=${orderNumber}`);
            } else {
              alert('Payment signature verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            alert('Error verifying payment transaction details.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: '#2d5a3d'
        }
      };

      if (razorpayOrderId.startsWith('order_mock_')) {
        // Local simulation fallback
        alert('[Sandbox Mode] Simulating successful payment workflow...');
        const mockVerifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
            razorpay_signature: 'mock_sig'
          })
        });
        const verifyData = await mockVerifyRes.json();
        if (mockVerifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-confirmation?orderNumber=${orderNumber}`);
        } else {
          alert('Failed mock checkout verification.');
        }
      } else {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid var(--color-indigo-200)',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: 'var(--color-indigo-950)',
    transition: 'border-color 0.25s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-indigo-900)',
    marginBottom: '6px',
    letterSpacing: '0.5px'
  };

  return (
    <div className="section" style={{ backgroundColor: '#faf9f6', minHeight: '85vh', paddingTop: '120px', paddingBottom: '80px', color: 'var(--color-indigo-950)' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container">
        <h1 style={{ fontSize: '38px', marginBottom: '40px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>Checkout</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '50px',
          alignItems: 'start'
        }} className="checkout-layout">
          
          {/* Column 1: Shipping Details Form */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-indigo-200)',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>Shipping Details</h2>
            <form onSubmit={handlePayment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="grid-2-col">
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleInputChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleInputChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" style={inputStyle} required />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Street Address</label>
                <input type="text" name="address" value={form.address} onChange={handleInputChange} placeholder="Flat/House No, Building, Street" style={inputStyle} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }} className="grid-3-col">
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" name="city" value={form.city} onChange={handleInputChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" name="state" value={form.state} onChange={handleInputChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input type="text" name="pincode" value={form.pincode} onChange={handleInputChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>Order Notes (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleInputChange} rows="3" placeholder="Special delivery instructions..." style={{ ...inputStyle, resize: 'none' }}></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="btn btn-primary btn-block"
                style={{ height: '54px', fontSize: '16px', backgroundColor: 'var(--color-indigo-950)', color: '#ffffff', cursor: 'pointer' }}
              >
                {loading ? 'Initiating Secure Payment...' : `Pay ₹${total}`}
              </button>
            </form>
          </div>

          {/* Column 2: Order Overview & Coupons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Order items overview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-indigo-200)',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)',
              color: 'var(--color-indigo-950)'
            }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--color-indigo-100)', paddingBottom: '10px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {cart.map((item) => (
                  <div key={item.variant_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <div style={{ color: 'var(--color-indigo-700)' }}>
                      {item.product_name} <span style={{ fontSize: '12px' }}>({item.variant_name})</span> x {item.quantity}
                    </div>
                    <strong style={{ color: 'var(--color-indigo-950)' }}>₹{item.total_price}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-indigo-100)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-indigo-600)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-indigo-600)' }}>
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
                    <span>Discount {activeCoupon ? `(${activeCoupon.code})` : ''}</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', borderTop: '1px dashed var(--color-indigo-200)', paddingTop: '16px', marginTop: '4px' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-indigo-950)' }}>₹{total}</span>
                </div>
              </div>
            </div>

            {/* Coupons Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-indigo-200)',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)',
              color: 'var(--color-indigo-950)'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>Apply Discount Code</h3>
              
              {activeCoupon ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(73, 92, 135, 0.08)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px dashed var(--color-indigo-300)'
                }}>
                  <div>
                    <strong style={{ color: 'var(--color-indigo-950)', fontSize: '14px' }}>{activeCoupon.code}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--color-indigo-600)', display: 'block' }}>Coupon Applied!</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={inputStyle}
                  />
                  <button type="submit" className="btn btn-secondary" style={{ padding: '0 20px', height: '45px', backgroundColor: 'var(--color-indigo-950)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                  {couponError}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
