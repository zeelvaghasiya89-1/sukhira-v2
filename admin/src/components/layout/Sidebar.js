"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AdminSidebarIcon({ type }) {
  if (type === 'dashboard') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    );
  }
  if (type === 'products') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8H4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3M21 8h-4v4h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z" />
        <path d="M6 3v2" />
        <path d="M10 3v2" />
        <path d="M14 3v2" />
      </svg>
    );
  }
  if (type === 'orders') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }
  if (type === 'customers') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (type === 'coupons') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    );
  }
  if (type === 'inventory') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    );
  }
  if (type === 'analytics') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }
  if (type === 'inbox') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  return null;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Products', path: '/products', icon: 'products' },
    { name: 'Orders', path: '/orders', icon: 'orders' },
    { name: 'Customers', path: '/customers', icon: 'customers' },
    { name: 'Coupons', path: '/coupons', icon: 'coupons' },
    { name: 'Inventory', path: '/inventory', icon: 'inventory' },
    { name: 'Inbox', path: '/inbox', icon: 'inbox' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  return (
    <aside className="admin-sidebar" style={{ backgroundColor: 'var(--admin-sidebar)' }}>
      {/* Brand logo/title */}
      <div className="admin-sidebar-header">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E3DFF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22C2 22 8 20 12 16C16 12 22 6 22 6S18 2 14 6C10 10 2 22 2 22Z" />
          <path d="M12 16L6 10" />
          <path d="M14 6L8 12" />
        </svg>
        <h2 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px', color: '#ffffff' }}>Sukhira Admin</h2>
      </div>

      {/* Nav menu */}
      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => {
          const isActive = item.path === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.path);

          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <AdminSidebarIcon type={item.icon} />
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Version badge */}
      <div style={{
        padding: '20px 24px',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        Sukhira v1.0.0
      </div>
    </aside>
  );
}
