"use client";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

export default function CouponsDashboard() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for creating a new coupon
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 0,
    usage_limit: '',
    expires_at: ''
  });
  
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch('/api/coupons');
        const data = await res.json();
        if (res.ok) {
          setCoupons(data.coupons || []);
        }
      } catch (err) {
        console.error('Failed to load coupons', err);
      } finally {
        setLoading(false);
      }
    }
    loadCoupons();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        discount_value: parseFloat(form.discount_value),
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        expires_at: form.expires_at || null
      };

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        // Refresh local list
        setCoupons([{ ...payload, id: data.id, times_used: 0, is_active: 1 }, ...coupons]);
        setShowForm(false);
        setForm({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: 10,
          min_order_amount: 0,
          usage_limit: '',
          expires_at: ''
        });
      } else {
        setError(data.error || 'Failed to create coupon');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon code? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(coupons.filter(c => c.id !== id));
      } else {
        alert('Failed to delete coupon');
      }
    } catch (err) {
      alert('Network error deleting coupon');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading coupons...</div>;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>Create and manage promotional discount coupons for checkout validations</p>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="admin-btn admin-btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Coupon'}
        </button>
      </div>

      {/* Creation Form Panel */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
            Create Coupon Code
          </h3>
          {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={handleCreateCoupon}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input 
                  type="text" 
                  name="code" 
                  className="form-input" 
                  value={form.code} 
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} 
                  placeholder="e.g. SAVE20" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Discount Type</label>
                <select name="discount_type" className="form-input" value={form.discount_type} onChange={handleInputChange}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Discount Value</label>
                <input 
                  type="number" 
                  name="discount_value" 
                  className="form-input" 
                  value={form.discount_value} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Purchase (₹)</label>
                <input type="number" name="min_order_amount" className="form-input" value={form.min_order_amount} onChange={handleInputChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Usage Limit (Optional)</label>
                <input type="number" name="usage_limit" className="form-input" value={form.usage_limit} onChange={handleInputChange} placeholder="Unlimited" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expiry Date (Optional)</label>
                <input type="date" name="expires_at" className="form-input" value={form.expires_at} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" name="description" className="form-input" value={form.description} onChange={handleInputChange} placeholder="e.g. 10% off on first order" />
            </div>

            <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
              {submitting ? 'Creating...' : 'Save Coupon'}
            </button>
          </form>
        </div>
      )}

      {/* Coupons List Table */}
      {coupons.length === 0 ? (
        <p style={{ color: 'var(--admin-muted)', textAlign: 'center', padding: '40px 0' }}>No promo codes generated yet.</p>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min Purchase</th>
                <th>Times Used</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const isExpired = c.expires_at && new Date().toISOString().split('T')[0] > c.expires_at;
                
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-primary)', fontFamily: 'monospace', fontSize: '15px' }}>{c.code}</td>
                    <td>{c.description || '-'}</td>
                    <td style={{ fontWeight: '600' }}>
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                    </td>
                    <td>{c.min_order_amount > 0 ? `₹${c.min_order_amount}` : 'None'}</td>
                    <td>{c.times_used} {c.usage_limit ? `/ ${c.usage_limit}` : ''}</td>
                    <td>{c.expires_at || 'Never'}</td>
                    <td>
                      {isExpired ? (
                        <span className="status-badge status-badge-cancelled">Expired</span>
                      ) : (
                        c.is_active === 1 ? (
                          <span className="status-badge status-badge-confirmed">Active</span>
                        ) : (
                          <span className="status-badge status-badge-pending">Inactive</span>
                        )
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteCoupon(c.id)}
                        style={{ color: 'var(--admin-danger)', padding: '6px 12px', fontSize: '13px' }}
                        className="admin-btn admin-btn-secondary"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
