"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
          setFilteredOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Handle Search and Filter
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o => 
        o.order_number.toLowerCase().includes(q) ||
        o.shipping_name.toLowerCase().includes(q) ||
        o.shipping_email.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(result);
  }, [search, statusFilter, orders]);

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading orders...</div>;
  }

  return (
    <div>
      {/* Search & Filter Top Bar */}
      <div className="admin-card" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '32px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search by order number, customer name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 16px' }}
          />
        </div>
        
        <div style={{ width: '180px' }}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 16px' }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--admin-muted)' }}>No orders match your search criteria.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Fulfillment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{order.order_number}</td>
                  <td>
                    <div>{order.shipping_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{order.shipping_email}</div>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <span className={`status-badge status-badge-${order.payment_status}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{formatCurrency(order.total)}</td>
                  <td>
                    <Link href={`/orders/${order.id}`} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
