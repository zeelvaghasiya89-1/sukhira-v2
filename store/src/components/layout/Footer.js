"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ type: 'loading', message: '' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: data.message || 'Thanks for joining!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to subscribe.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to connect.' });
    }
  };

  return (
    <footer style={{
      backgroundColor: '#1B2340',
      color: '#F5F7FC',
      padding: '96px 0 48px 0',
      borderTop: '1px solid rgba(166, 179, 213, 0.15)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 2fr',
          gap: '48px',
          marginBottom: '64px'
        }} className="footer-grid">
          {/* Column 1: Brand details */}
          <div>
            <h3 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '24px', 
              fontWeight: '600',
              marginBottom: '24px',
              color: '#ffffff'
            }}>Sukhira</h3>
            <p style={{ 
              color: 'var(--color-indigo-300)', 
              fontSize: '15px', 
              maxWidth: '320px',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              Thoughtfully crafted natural wellness products designed to help you slow down, relax, and create mindful daily rituals.
            </p>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <a href="#" style={{ color: 'var(--color-indigo-400)', transition: 'color 0.2s' }}>Instagram</a>
              <a href="#" style={{ color: 'var(--color-indigo-400)', transition: 'color 0.2s' }}>Facebook</a>
              <a href="#" style={{ color: 'var(--color-indigo-400)', transition: 'color 0.2s' }}>Twitter</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#ffffff' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px' }}>
              <Link href="/shop" style={{ color: 'var(--color-indigo-300)' }}>Blue Tea</Link>
              <Link href="/shop" style={{ color: 'var(--color-indigo-300)' }}>Chamomile Tea</Link>
              <Link href="/shop" style={{ color: 'var(--color-indigo-300)' }}>Gift Boxes</Link>
              <Link href="/shop" style={{ color: 'var(--color-indigo-300)' }}>Accessories</Link>
            </div>
          </div>

          {/* Column 3: Help / Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#ffffff' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px' }}>
              <Link href="/about" style={{ color: 'var(--color-indigo-300)' }}>Our Story</Link>
              <Link href="/contact" style={{ color: 'var(--color-indigo-300)' }}>Contact Us</Link>
              <Link href="/track" style={{ color: 'var(--color-indigo-300)' }}>Track Order</Link>
              <Link href="/shipping-policy" style={{ color: 'var(--color-indigo-300)' }}>Shipping Policy</Link>
              <Link href="/faq" style={{ color: 'var(--color-indigo-300)' }}>FAQ</Link>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#ffffff' }}>Join the Ritual</h4>
            <p style={{ 
              color: 'var(--color-indigo-300)', 
              fontSize: '15px', 
              lineHeight: '1.6', 
              marginBottom: '24px'
            }}>
              Subscribe to receive wellness tips, brewing rituals, and exclusive offers.
            </p>
            <form style={{ display: 'flex', gap: '12px' }} onSubmit={handleSubscribe}>
              <input 
                suppressHydrationWarning={true}
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status.type === 'loading'}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(166, 179, 213, 0.15)',
                  color: '#ffffff',
                  borderRadius: '30px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  flex: 1
                }}
              />
              <button 
                suppressHydrationWarning={true}
                type="submit"
                disabled={status.type === 'loading'}
                style={{
                  backgroundColor: 'var(--color-indigo-100)',
                  color: 'var(--color-indigo-950)',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '14px',
                  cursor: status.type === 'loading' ? 'not-allowed' : 'pointer'
                }}
              >
                {status.type === 'loading' ? '...' : 'Join'}
              </button>
            </form>
            {status.message && (
              <p style={{ 
                marginTop: '12px', 
                fontSize: '13px', 
                color: status.type === 'success' ? 'var(--color-accent-pea)' : 'var(--color-error)'
              }}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid rgba(166, 179, 213, 0.15)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: 'var(--color-indigo-400)'
        }} className="footer-bottom">
          <p>© {new Date().getFullYear()} Sukhira Wellness. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }} className="footer-bottom-links">
            <Link href="/privacy-policy" style={{ color: 'var(--color-indigo-400)' }}>Privacy Policy</Link>
            <Link href="/terms-of-service" style={{ color: 'var(--color-indigo-400)' }}>Terms of Service</Link>
            <Link href="/refund-policy" style={{ color: 'var(--color-indigo-400)' }}>Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
