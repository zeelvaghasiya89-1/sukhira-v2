"use client";
import React, { useState } from 'react';

export default function OrderTrackingPage() {
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Results
  const [result, setResult] = useState(null);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track?number=${encodeURIComponent(number)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to locate order. Please check inputs.');
      }
    } catch (err) {
      setError('An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgressIndex = (status) => {
    const steps = ['manifested', 'picked up', 'in transit', 'out for delivery', 'delivered'];
    return steps.indexOf(status?.toLowerCase());
  };

  return (
    <div style={{ backgroundColor: 'var(--color-indigo-950)', minHeight: '100vh', padding: '160px 0 96px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Tracker Search Box */}
        <div style={{
          backgroundColor: 'var(--color-indigo-100)',
          borderRadius: 'var(--border-radius-card)',
          padding: '40px',
          border: '1px solid var(--color-indigo-200)',
          boxShadow: 'var(--shadow-medium)',
          marginBottom: '40px'
        }}>
          <h1 className="h2-ds" style={{ color: 'var(--color-indigo-950)', marginBottom: '10px', letterSpacing: '-1px' }}>Track Your Order</h1>
          <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '30px' }}>
            Enter your Sukhira Order Number (e.g. SUK-1001) or Delhivery AWB number along with your billing email address to track package dispatch.
          </p>

          <form onSubmit={handleTrackSubmit} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: '16px',
            alignItems: 'end'
          }} className="track-form">
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Order ID / AWB Tracking ID</label>
              <input 
                type="text" 
                placeholder="e.g. SUK-1001" 
                value={number} 
                onChange={(e) => setNumber(e.target.value)} 
                required 
                disabled={loading}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-indigo-300)',
                  color: 'var(--color-indigo-950)',
                  width: '100%'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Billing Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. customer@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-indigo-300)',
                  color: 'var(--color-indigo-950)',
                  width: '100%'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{
                backgroundColor: 'var(--color-indigo-950)',
                color: '#ffffff',
                height: '46px',
                padding: '0 32px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Locating...' : 'Locate Infusion'}
            </button>
          </form>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#b91c1c',
              padding: '14px',
              borderRadius: '12px',
              marginTop: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✕ {error}
            </div>
          )}
        </div>

        {/* Tracking Results Area */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Visual Stepper Progress Bar */}
            <div style={{
              backgroundColor: 'var(--color-indigo-900)',
              borderRadius: 'var(--border-radius-card)',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'var(--shadow-medium)'
            }}>
              <h2 className="h3-ds" style={{ color: '#ffffff', marginBottom: '32px' }}>Fulfillment Status</h2>

              {/* Stepper nodes */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                marginBottom: '40px'
              }} className="stepper-track">
                
                {/* Background Connecting line */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '4%',
                  right: '4%',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1
                }} />

                {/* Foreground active line */}
                {result.order.tracking_id && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '4%',
                    width: `${Math.min(92, Math.max(0, getStepProgressIndex(result.tracking?.status) * 23))}%`,
                    height: '4px',
                    backgroundColor: 'var(--color-accent-pea)',
                    zIndex: 2,
                    transition: 'width 0.5s ease'
                  }} />
                )}

                {/* Nodes */}
                {['Manifested', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                  const currentIdx = result.order.tracking_id ? getStepProgressIndex(result.tracking?.status) : -1;
                  const isCompleted = idx <= currentIdx;
                  const isActive = idx === currentIdx;

                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 3,
                      width: '18%'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? 'var(--color-accent-pea)' : 'var(--color-indigo-950)',
                        border: `3px solid ${isCompleted ? 'var(--color-accent-pea)' : 'rgba(255,255,255,0.15)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted ? '#1B2340' : '#ffffff',
                        fontWeight: '700',
                        fontSize: '13px',
                        boxShadow: isActive ? '0 0 15px var(--color-accent-pea)' : 'none'
                      }}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: isCompleted ? '600' : '400',
                        color: isCompleted ? '#ffffff' : 'var(--color-indigo-300)',
                        marginTop: '10px',
                        textAlign: 'center'
                      }}>{step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status banner */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }} className="status-banner-flex">
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-indigo-300)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Current State</span>
                  <strong style={{ fontSize: '18px', color: '#ffffff' }}>
                    {result.order.tracking_id ? (result.tracking?.status || 'Shipped via Delhivery') : result.order.status.toUpperCase()}
                  </strong>
                </div>
                {result.order.tracking_id && (
                  <div style={{ textAlign: 'right' }} className="status-banner-right">
                    <span style={{ fontSize: '12px', color: 'var(--color-indigo-300)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Delhivery AWB ID</span>
                    <strong style={{ fontSize: '18px', color: 'var(--color-accent-pea)', fontFamily: 'monospace' }}>{result.order.tracking_id}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Stepper scans log details */}
            {result.order.tracking_id && result.tracking?.checkpoints && (
              <div style={{
                backgroundColor: 'var(--color-indigo-900)',
                borderRadius: 'var(--border-radius-card)',
                padding: '40px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: 'var(--shadow-medium)'
              }}>
                <h3 className="h3-ds" style={{ color: '#ffffff', marginBottom: '24px' }}>Detailed Scans Timeline</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px', marginLeft: '12px' }}>
                  {result.tracking.checkpoints.map((scan, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '-31px',
                        top: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: i === 0 ? 'var(--color-accent-pea)' : 'var(--color-indigo-300)',
                        border: '2px solid var(--color-indigo-900)'
                      }} />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: i === 0 ? '#ffffff' : 'var(--color-indigo-300)' }}>
                        {scan.status} - <span style={{ fontWeight: '400', fontSize: '13px' }}>{scan.location}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-indigo-200)', margin: '4px 0 0 0' }}>{scan.description}</p>
                      <span style={{ fontSize: '11px', color: 'var(--color-indigo-400)', display: 'block', marginTop: '2px' }}>
                        {new Date(scan.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order details & billing summary (Light Off-White Card) */}
            <div style={{
              backgroundColor: 'var(--color-indigo-100)',
              borderRadius: 'var(--border-radius-card)',
              padding: '40px',
              border: '1px solid var(--color-indigo-200)',
              boxShadow: 'var(--shadow-medium)'
            }}>
              <h3 className="h3-ds" style={{ color: 'var(--color-indigo-950)', marginBottom: '24px' }}>Items Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {result.order.items && result.order.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(27, 35, 64, 0.08)',
                    paddingBottom: '12px'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--color-indigo-950)', fontSize: '15px' }}>{item.product_name}</strong>
                      <span style={{ display: 'block', fontSize: '13px', color: 'var(--color-indigo-900)' }}>{item.variant_name} × {item.quantity}</span>
                    </div>
                    <strong style={{ color: 'var(--color-indigo-950)' }}>{formatCurrency(item.total_price)}</strong>
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'end', fontSize: '14px', color: 'var(--color-indigo-900)' }}>
                <div style={{ display: 'flex', gap: '80px' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(result.order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', gap: '80px' }}>
                  <span>Shipping Cost:</span>
                  <span>{result.order.shipping_cost === 0 ? 'Free' : formatCurrency(result.order.shipping_cost)}</span>
                </div>
                {result.order.discount_amount > 0 && (
                  <div style={{ display: 'flex', gap: '80px', color: 'var(--color-accent-pea)' }}>
                    <span>Discount Code Applied:</span>
                    <span>-{formatCurrency(result.order.discount_amount)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  gap: '80px',
                  borderTop: '1px solid var(--color-indigo-300)',
                  paddingTop: '10px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--color-indigo-950)'
                }}>
                  <span>Total Paid:</span>
                  <span>{formatCurrency(result.order.total)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .track-form {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .stepper-track {
            flex-direction: column !important;
            gap: 20px !important;
            border-left: 2px solid rgba(255,255,255,0.15) !important;
            padding-left: 20px !important;
            align-items: flex-start !important;
            margin-left: 10px !important;
          }
          .stepper-track div {
            flex-direction: row !important;
            width: 100% !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .stepper-track div span {
            margin-top: 0 !important;
          }
          .stepper-track div::after {
            display: none !important;
          }
          .status-banner-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .status-banner-right {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
