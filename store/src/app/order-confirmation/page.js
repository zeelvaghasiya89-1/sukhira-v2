"use client";
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderNum, setOrderNum] = useState('');

  const urlOrderNumber = searchParams.get('orderNumber');
  const paymentId = searchParams.get('razorpay_payment_id');
  const paymentLinkId = searchParams.get('razorpay_payment_link_id');
  const signature = searchParams.get('razorpay_signature');

  useEffect(() => {
    async function verifyAndConfirm() {
      // Case 1: Direct orderNumber provided (already verified or mock fallback)
      if (urlOrderNumber) {
        setOrderNum(urlOrderNumber);
        setLoading(false);
        return;
      }

      // Case 2: Redirected from Razorpay Hosted Payment Link
      if (paymentId && paymentLinkId) {
        try {
          const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: paymentId,
              razorpay_payment_link_id: paymentLinkId,
              razorpay_signature: signature
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setOrderNum(data.orderNumber);
          } else {
            setError(data.error || 'Payment signature verification failed.');
          }
        } catch (err) {
          console.error('Verify error:', err);
          setError('Failed to contact server for payment verification.');
        } finally {
          setLoading(false);
        }
      } else {
        // No parameters at all
        setError('No order parameters or payment logs found.');
        setLoading(false);
      }
    }

    verifyAndConfirm();
  }, [urlOrderNumber, paymentId, paymentLinkId, signature]);

  if (loading) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-cream)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ border: '4px solid rgba(0,0,0,0.1)', borderLeftColor: 'var(--color-primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--color-stone)' }}>Verifying secure payment transaction status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-cream)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{
            backgroundColor: 'var(--color-warm-white)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--border-radius)',
            padding: '50px 30px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: '#dc2626' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#991b1b' }}>Verification Error</h1>
            <p style={{ fontSize: '16px', color: 'var(--color-stone)', marginBottom: '32px', lineHeight: '1.6' }}>
              We could not verify your payment link: <b>{error}</b>. Please check your bank statement or contact Sukhira Support.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Contact Support
              </Link>
              <Link href="/" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-cream)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{
          backgroundColor: 'var(--color-warm-white)',
          border: '1px solid var(--color-sand)',
          borderRadius: 'var(--border-radius)',
          padding: '50px 30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-primary)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8H4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3M21 8h-4v4h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z" />
              <path d="M6 3v2" />
              <path d="M10 3v2" />
              <path d="M14 3v2" />
            </svg>
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>Order Confirmed!</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-stone)', marginBottom: '32px', lineHeight: '1.6' }}>
            Thank you for starting your wellness journey with Sukhira. Your payment has been securely verified, and we are preparing your tea blend for shipment.
          </p>

          {orderNum && (
            <div style={{
              backgroundColor: 'var(--color-cream)',
              border: '1px dashed var(--color-sand)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '32px',
              fontSize: '15px'
            }}>
              <span style={{ color: 'var(--color-stone)', marginRight: '8px' }}>Order Number:</span>
              <strong style={{ color: 'var(--color-primary-dark)', fontFamily: 'monospace', fontSize: '16px' }}>{orderNum}</strong>
            </div>
          )}

          <p style={{ fontSize: '13px', color: 'var(--color-stone)', marginBottom: '40px' }}>
            A confirmation email containing delivery details and invoice has been sent to your email address.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              Continue Shopping
            </Link>
            <Link href="/" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: 'var(--color-cream)' }}>
        <p style={{ color: 'var(--color-stone)' }}>Loading confirmation details...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
