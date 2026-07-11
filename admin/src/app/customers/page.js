"use client";
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        if (res.ok) {
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading customer directory...</div>;
  }

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>
          View customer contacts, order frequencies, and lifetime values compiled dynamically from completed orders.
        </p>
      </div>

      {customers.length === 0 ? (
        <p style={{ color: 'var(--admin-muted)', textAlign: 'center', padding: '40px 0' }}>No customer profiles recorded yet.</p>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>City</th>
                <th>State</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '600' }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{c.city || '-'}</td>
                  <td>{c.state || '-'}</td>
                  <td>{c.total_orders} orders</td>
                  <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>{formatCurrency(c.total_spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
