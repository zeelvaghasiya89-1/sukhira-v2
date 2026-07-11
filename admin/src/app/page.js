"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Draw chart on canvas
  useEffect(() => {
    if (!data || !data.chart || data.chart.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const points = data.chart;
    const maxVal = Math.max(...points.map(p => p.revenue), 1000); // minimum scale limit

    // Drawing Grid Lines & labels
    ctx.strokeStyle = '#e2e5f0';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter';
    ctx.fillStyle = '#6b7194';

    // 4 horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      ctx.fillText(`₹${val}`, 5, y + 3);
    }

    // Draw Line Chart Path
    ctx.strokeStyle = '#2d5a3d';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = padding + (chartWidth / (points.length - 1)) * idx;
      const y = padding + chartHeight - (chartHeight * (p.revenue / maxVal));
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw Filled Area below path
    ctx.fillStyle = 'rgba(45, 90, 61, 0.05)';
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = padding + (chartWidth / (points.length - 1)) * idx;
      const y = padding + chartHeight - (chartHeight * (p.revenue / maxVal));
      if (idx === 0) {
        ctx.moveTo(x, padding + chartHeight);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      if (idx === points.length - 1) {
        ctx.lineTo(x, padding + chartHeight);
      }
    });
    ctx.closePath();
    ctx.fill();

    // Draw Point Circles & tooltip-like guides
    points.forEach((p, idx) => {
      const x = padding + (chartWidth / (points.length - 1)) * idx;
      const y = padding + chartHeight - (chartHeight * (p.revenue / maxVal));
      
      // Draw small circle
      ctx.fillStyle = '#2a4b7c';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw date labels on bottom for every 5th item
      if (idx % Math.ceil(points.length / 5) === 0 || idx === points.length - 1) {
        ctx.fillStyle = '#6b7194';
        const dateStr = p.date.split('-').slice(1).join('/'); // MM/DD format
        ctx.fillText(dateStr, x - 10, canvas.height - 15);
      }
    });

  }, [data]);

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading dashboard summary...</div>;
  }

  const stats = data?.stats || { totalRevenue: 0, todayOrders: 0, activeCustomers: 0, lowStockItems: 0 };
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStock || [];

  return (
    <div>
      {/* 1. Stat cards grid */}
      <div className="admin-stats-grid">
        
        <div className="admin-card stat-card">
          <span className="stat-title">Total Revenue</span>
          <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
        </div>

        <div className="admin-card stat-card">
          <span className="stat-title">Orders Today</span>
          <span className="stat-value">{stats.todayOrders}</span>
        </div>

        <div className="admin-card stat-card">
          <span className="stat-title">Active Customers</span>
          <span className="stat-value">{stats.activeCustomers}</span>
        </div>

        <div className="admin-card stat-card">
          <span className="stat-title">Low Stock Items</span>
          <span className="stat-value" style={{ color: stats.lowStockItems > 0 ? 'var(--admin-danger)' : 'inherit' }}>
            {stats.lowStockItems}
          </span>
        </div>

      </div>

      {/* 2. Charts & Alerts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        marginBottom: '32px'
      }} className="dashboard-layout-row">
        
        {/* Sales Chart */}
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Revenue (Past 30 Days)</h2>
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <canvas 
              ref={canvasRef} 
              width="600" 
              height="300"
              style={{ width: '100%', height: '100%' }}
            ></canvas>
          </div>
        </div>

        {/* Low stock indicators */}
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--admin-danger)' }}>Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>All item stock levels are healthy.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {lowStock.map((alert, i) => (
                <div 
                  key={i} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '10px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{alert.product_name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{alert.variant_name} ({alert.sku})</p>
                  </div>
                  <span style={{
                    color: 'var(--admin-danger)',
                    fontWeight: '700',
                    fontSize: '14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {alert.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 3. Recent orders list */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Orders</h2>
          <Link href="/orders" style={{ fontSize: '13px', color: 'var(--admin-primary)', fontWeight: '600' }}>
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--admin-muted)', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>No orders placed yet.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                      <Link href={`/orders/${order.id}`} style={{ color: 'var(--admin-primary)', fontSize: '13px', fontWeight: '500' }}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .dashboard-layout-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
