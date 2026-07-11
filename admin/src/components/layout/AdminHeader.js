"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Create human-readable title based on current path
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard Overview';
    const segment = pathname.split('/')[1];
    if (!segment) return 'Dashboard';
    // Capitalize and format
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="admin-header">
      {/* Title */}
      <h1 style={{ fontSize: '20px', fontWeight: '600' }}>{getPageTitle()}</h1>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(45, 90, 61, 0.1)',
            color: 'var(--admin-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600'
          }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <span>{user?.username || 'Admin'}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="admin-btn admin-btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
