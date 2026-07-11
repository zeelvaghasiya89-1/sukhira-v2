"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

export default function OrderDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [weight, setWeight] = useState(0.5);
  const [error, setError] = useState('');

  async function loadOrder() {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Failed to load order');
      }
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder({ ...order, status: newStatus });
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Network error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleShipOrder = async (e) => {
    e.preventDefault();
    setShipping(true);
    try {
      const res = await fetch(`/api/orders/${id}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Shipment successfully registered with Delhivery!\nWaybill AWB: ' + data.waybill);
        loadOrder(); // reload to get tracking info
      } else {
        alert(data.error || 'Failed to register shipment.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error registering shipment.');
    } finally {
      setShipping(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'var(--admin-danger)' }}>{error || 'Order not found'}</p>
        <Link href="/orders" className="admin-btn admin-btn-secondary" style={{ marginTop: '20px' }}>Back to Orders</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--admin-muted)' }}>
        <Link href="/orders" style={{ color: 'var(--admin-primary)' }}>Orders</Link> / <span>Order details ({order.order_number})</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }} className="orders-details-layout">
        
        {/* Left Side: Order Items and Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Order items card */}
          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Line Items</h3>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '500' }}>{item.product_name}</td>
                      <td>{item.variant_name}</td>
                      <td>{formatCurrency(item.unit_price)}</td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Calculations */}
            <div style={{
              borderTop: '1px solid var(--admin-border)',
              paddingTop: '20px',
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', gap: '80px' }}>
                <span style={{ color: 'var(--admin-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', gap: '80px' }}>
                <span style={{ color: 'var(--admin-muted)' }}>Shipping Cost:</span>
                <span>{order.shipping_cost === 0 ? 'Free' : formatCurrency(order.shipping_cost)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div style={{ display: 'flex', gap: '80px', color: 'var(--admin-success)' }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                gap: '80px', 
                borderTop: '1px solid var(--admin-border)', 
                paddingTop: '10px',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--admin-primary)'
              }}>
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Details */}
          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2-col">
              <div>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)' }}>Recipient Name</strong>
                  {order.shipping_name}
                </p>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)' }}>Address</strong>
                  {order.shipping_address}<br />
                  {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                </p>
                <p style={{ fontSize: '14px' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)' }}>Contact Phone</strong>
                  {order.shipping_phone}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)' }}>Email Address</strong>
                  {order.shipping_email}
                </p>
                <p style={{ fontSize: '14px' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)' }}>Order Notes</strong>
                  <span style={{ color: order.notes ? 'inherit' : 'var(--admin-muted)', fontStyle: order.notes ? 'normal' : 'italic' }}>
                    {order.notes || 'No instructions provided.'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Live Delhivery Tracking Checkpoints scan log (Admin View) */}
          {order.tracking_id && order.tracking_info && (
            <div className="admin-card">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Delhivery Tracking Log</h3>
              <p style={{ fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '24px' }}>
                AWB ID: <strong style={{ color: 'var(--admin-primary)', fontFamily: 'monospace' }}>{order.tracking_id}</strong>
              </p>
              
              {order.tracking_info.checkpoints && order.tracking_info.checkpoints.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--admin-muted)' }}>Manifested. Awaiting carrier pickup scans...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '2px solid var(--admin-border)', paddingLeft: '24px', marginLeft: '12px' }}>
                  {order.tracking_info.checkpoints.map((scan, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      {/* dot */}
                      <span style={{
                        position: 'absolute',
                        left: '-31px',
                        top: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: i === 0 ? 'var(--admin-success)' : 'var(--admin-border)',
                        border: '2px solid var(--admin-card-bg)'
                      }} />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: i === 0 ? '#ffffff' : 'var(--admin-muted)' }}>
                        {scan.status} - <span style={{ fontWeight: '400', fontSize: '13px' }}>{scan.location}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--admin-muted)', margin: '4px 0 0 0' }}>{scan.description}</p>
                      <span style={{ fontSize: '11px', color: 'var(--admin-muted)', display: 'block', marginTop: '2px' }}>
                        {new Date(scan.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Fulfillment Actions & Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Status Panel */}
          <div className="admin-card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Status Dashboard</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '6px' }}>Fulfillment Status</span>
              <span className={`status-badge status-badge-${order.status}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                {order.status}
              </span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '6px' }}>Payment Status</span>
              <span className={`status-badge status-badge-${order.payment_status}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                {order.payment_status}
              </span>
            </div>

            {/* Quick Actions */}
            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--admin-muted)', marginBottom: '12px', fontWeight: '600' }}>Fulfillment Actions</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.status === 'pending' && (
                  <button 
                    disabled={updating}
                    onClick={() => handleStatusUpdate('confirmed')}
                    className="admin-btn admin-btn-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    Confirm Order
                  </button>
                )}
                {(order.status === 'confirmed' || order.status === 'pending') && (
                  <button 
                    disabled={updating}
                    onClick={() => handleStatusUpdate('processing')}
                    className="admin-btn admin-btn-primary"
                    style={{ justifyContent: 'center', backgroundColor: '#0284c7' }}
                  >
                    Start Processing
                  </button>
                )}
                {order.status === 'processing' && !order.tracking_id && (
                  <div style={{ 
                    border: '1px solid var(--admin-border)', 
                    borderRadius: '12px', 
                    padding: '16px',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    marginBottom: '10px'
                  }}>
                    <label className="form-label" style={{ marginBottom: '8px' }}>Estimated Box Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={weight} 
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="form-input" 
                      style={{ marginBottom: '12px', backgroundColor: 'var(--admin-input-bg)' }}
                    />
                    <button 
                      disabled={shipping}
                      onClick={handleShipOrder}
                      className="admin-btn admin-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', backgroundColor: '#4f46e5' }}
                    >
                      {shipping ? 'Generating AWB...' : 'Ship via Delhivery'}
                    </button>
                  </div>
                )}
                {order.status === 'shipped' && (
                  <button 
                    disabled={updating}
                    onClick={() => handleStatusUpdate('delivered')}
                    className="admin-btn admin-btn-primary"
                    style={{ justifyContent: 'center', backgroundColor: '#059669' }}
                  >
                    Mark Delivered
                  </button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <button 
                    disabled={updating}
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="admin-btn admin-btn-secondary"
                    style={{ justifyContent: 'center', borderColor: 'var(--admin-danger)', color: 'var(--admin-danger)' }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Delhivery Courier Info */}
          {order.tracking_id && (
            <div className="admin-card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Courier Details</h3>
              
              <div style={{ marginBottom: '14px' }}>
                <strong style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>AWB Tracking ID</strong>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', fontFamily: 'monospace' }}>{order.tracking_id}</span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>Courier Partner</strong>
                <span style={{ fontSize: '14px', color: '#ffffff' }}>Delhivery Express</span>
              </div>

              {order.shipping_label_url && (
                <a 
                  href={order.shipping_label_url}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
                >
                  Print Packing Slip / Label
                </a>
              )}
            </div>
          )}

          {/* Payment gateway metadata */}
          <div className="admin-card">
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Gateway Metadata</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <strong style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>Razorpay Order ID</strong>
              <span style={{ fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.razorpay_order_id || 'N/A'}</span>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>Razorpay Payment ID</strong>
              <span style={{ fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.razorpay_payment_id || 'N/A'}</span>
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .orders-details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
