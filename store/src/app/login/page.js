"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const { user, loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to shop
  useEffect(() => {
    if (user) {
      router.push('/shop');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/shop');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/shop');
    } catch (err) {
      console.error(err);
      setError('Google login was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px 24px',
      background: 'linear-gradient(135deg, var(--color-indigo-100) 0%, var(--color-cream) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Blur Spheres */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '45%',
        background: 'radial-gradient(circle, rgba(163, 196, 188, 0.4) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '45%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(74, 111, 165, 0.25) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main Login Card - Glassmorphism Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.98)', // White Tone contrast
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 50px rgba(27, 35, 64, 0.1)',
        border: '1px solid var(--color-sand)',
        backdropFilter: 'blur(20px)',
        color: 'var(--color-indigo-950)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--color-indigo-950)',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--color-stone)', fontSize: '15px' }}>
            Sign in to access your orders, track shipments & coupons
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--color-secondary)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-indigo-900)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1.5px solid var(--color-sand)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.25s ease',
                backgroundColor: '#f8fafc',
                color: 'var(--color-indigo-950)'
              }}
              className="login-input"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-indigo-900)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1.5px solid var(--color-sand)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.25s ease',
                backgroundColor: '#f8fafc',
                color: 'var(--color-indigo-950)'
              }}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-indigo-950)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(27, 35, 64, 0.2)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              marginTop: '10px'
            }}
            className="login-submit-btn"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          color: 'var(--color-stone)',
          fontSize: '13px'
        }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-sand)' }} />
          <span style={{ padding: '0 12px' }}>or continue with</span>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-sand)' }} />
        </div>

        {/* Google Sign In Option */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-sand)',
            color: 'var(--color-indigo-950)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background-color 0.2s ease, border-color 0.2s ease'
          }}
          className="google-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14 1.14 2.51v2.08h1.8a11.5 11.5 0 0 0 3.11-7.44Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-4v3.1A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1h-4a12 12 0 0 0 0 10.74l4-3.1Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0A12 12 0 0 0 1.27 6.63l4 3.1c.95-2.85 3.6-4.98 6.73-4.98Z"
            />
          </svg>
          Google Account
        </button>

        {/* Redirect Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '32px',
          fontSize: '14px',
          color: 'var(--color-stone)'
        }}>
          New to Sukhira?{' '}
          <Link href="/register" style={{
            color: 'var(--color-indigo-900)',
            fontWeight: '600',
            textDecoration: 'underline'
          }}>
            Create an Account
          </Link>
        </p>
      </div>

      {/* Global CSS Style tag for subtle animations */}
      <style jsx global>{`
        .login-input:focus {
          border-color: var(--color-indigo-600) !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1) !important;
        }
        .login-submit-btn:hover {
          background-color: #12182c !important;
          transform: translateY(-1px);
        }
        .google-btn:hover {
          background-color: #f8fafc !important;
          border-color: var(--color-stone) !important;
        }
      `}</style>
    </div>
  );
}
