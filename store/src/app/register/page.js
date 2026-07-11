"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerRegisterPage() {
  const { user, signUpWithEmail } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      router.push('/shop');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
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

      {/* Main Registration Card - High Contrast White Backdrop Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.98)',
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
            Create Account
          </h2>
          <p style={{ color: 'var(--color-stone)', fontSize: '15px' }}>
            Register to join the Sukhira natural wellness community
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="name" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-indigo-900)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
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
              className="register-input"
            />
          </div>

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
              className="register-input"
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-indigo-900)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
              className="register-input"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-indigo-900)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
              className="register-input"
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
            className="register-submit-btn"
          >
            {loading ? 'Registering Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Redirect Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '32px',
          fontSize: '14px',
          color: 'var(--color-stone)'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{
            color: 'var(--color-indigo-900)',
            fontWeight: '600',
            textDecoration: 'underline'
          }}>
            Log In
          </Link>
        </p>
      </div>

      {/* Global CSS Style tag for inputs */}
      <style jsx global>{`
        .register-input:focus {
          border-color: var(--color-indigo-600) !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1) !important;
        }
        .register-submit-btn:hover {
          background-color: #12182c !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
