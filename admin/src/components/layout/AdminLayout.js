"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { loading, user } = useAuth();

  const isLoginPage = pathname === '/login';

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--admin-bg)',
        fontFamily: 'var(--font-sans)',
        fontSize: '15px',
        color: 'var(--admin-muted)'
      }}>
        Loading admin session...
      </div>
    );
  }

  // If on login page, render children directly without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Render shell for authenticated pages
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
