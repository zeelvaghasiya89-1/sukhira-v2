"use client";
import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '@/utils/format';

export default function AnalyticsReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics data', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Draw chart
  useEffect(() => {
    if (!data || !data.chart || data.chart.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const points = data.chart;
    const maxVal = Math.max(...points.map(p => p.revenue), 1000);

    // Draw grid
    ctx.strokeStyle = '#e2e5f0';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter';
    ctx.fillStyle = '#6b7194';

    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      ctx.fillText(`₹${val}`, 5, y + 3);
    }

    // Line Path
    ctx.strokeStyle = '#4a6fa5'; // Indigo Blue color for analytics
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = padding + (chartWidth / (points.length - 1)) * idx;
      const y = padding + chartHeight - (chartHeight * (p.revenue / maxVal));
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Area
    ctx.fillStyle = 'rgba(74, 111, 165, 0.05)';
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

    // Points
    points.forEach((p, idx) => {
      const x = padding + (chartWidth / (points.length - 1)) * idx;
      const y = padding + chartHeight - (chartHeight * (p.revenue / maxVal));
      
      ctx.fillStyle = '#4a6fa5';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (idx % Math.ceil(points.length / 5) === 0 || idx === points.length - 1) {
        ctx.fillStyle = '#6b7194';
        const dateStr = p.date.split('-').slice(1).join('/');
        ctx.fillText(dateStr, x - 10, canvas.height - 15);
      }
    });

  }, [data]);

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading analytics reports...</div>;
  }

  const topProducts = data?.top || [];

  return (
    <div>
      {/* Analytics widgets row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr',
        gap: '32px'
      }} className="analytics-layout">
        
        {/* Trend Graph */}
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Sales Revenue Trend</h2>
          <div style={{ position: 'relative', width: '100%', height: '350px' }}>
            <canvas 
              ref={canvasRef} 
              width="600" 
              height="350"
              style={{ width: '100%', height: '100%' }}
            ></canvas>
          </div>
        </div>

        {/* Top items table */}
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Best Selling Products</h2>
          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>No sales data available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProducts.map((p, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '12px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{p.product_name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{p.units_sold} units sold</p>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--admin-primary)' }}>
                    {formatCurrency(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .analytics-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
