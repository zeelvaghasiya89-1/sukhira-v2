"use client";
import React, { useState } from 'react';

export default function SettingsDashboard() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }

    if (passwords.new.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Password updated successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="admin-card">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
          Change Administrator Password
        </h3>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
        {success && <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--admin-success)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{success}</div>}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Current Password</label>
            <input 
              type="password" 
              name="current" 
              className="form-input" 
              value={passwords.current} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              name="new" 
              className="form-input" 
              value={passwords.new} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password" 
              name="confirm" 
              className="form-input" 
              value={passwords.confirm} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ alignSelf: 'start', padding: '10px 24px' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
