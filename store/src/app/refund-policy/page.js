import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-indigo-100)', paddingTop: '160px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--border-radius-card)',
          padding: '50px 40px',
          border: '1px solid rgba(166, 179, 213, 0.25)',
          boxShadow: 'var(--shadow-small)',
          maxWidth: '800px',
          margin: '0 auto',
          color: 'var(--color-indigo-950)'
        }} className="policy-content">
          <h1 className="h1-ds" style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--color-indigo-950)', letterSpacing: '-1px' }}>Refund Policy</h1>
          <p className="caption-ds" style={{ color: 'var(--color-indigo-600)', marginBottom: '36px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Effective Date: July 11, 2026</p>
          
          <div className="policy-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
              At Sukhira, we want you to be happy with your purchase. Please read this Refund Policy carefully before placing an order.
            </p>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>1. Eligibility for Refunds</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>Refunds may be approved in the following cases:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>You received the wrong product</li>
                <li>You received a damaged product</li>
                <li>You received a defective product</li>
                <li>Your order was lost in transit</li>
                <li>We are unable to fulfill your order</li>
              </ul>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginTop: '12px', lineHeight: '1.7' }}>
                To be eligible, you must contact us within 48 hours of delivery and share clear photos or videos of the issue.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>2. Items Not Eligible for Refund</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>We do not accept refund requests for:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>Opened, used, or partially consumed products</li>
                <li>Products damaged due to misuse, improper storage, or negligence</li>
                <li>Change of mind after delivery, unless specifically allowed by us</li>
                <li>Products returned without prior approval</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>3. Refund Process</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Once your request is received, we may ask for order details, photos, videos, or other supporting information. If your request is approved, the refund will be processed to your original payment method or another suitable method depending on the payment provider and order status.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>4. Refund Timeline</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Approved refunds are usually processed within 7 to 10 business days after approval. In some cases, your bank or payment provider may take additional time to reflect the amount in your account.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>5. Shipping Charges</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Original shipping charges are non-refundable unless the refund is due to our error, such as a wrong, damaged, or defective product.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>6. Replacement or Exchange</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                In some cases, we may offer a replacement or exchange instead of a refund, subject to product availability and issue verification.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>7. Cancellation Before Shipping</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                If an order has not yet been shipped, cancellation may be possible. Once the order has been packed or dispatched, cancellation may not be possible.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>8. How to Request a Refund</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                To request a refund, contact us with your order number and issue details at: <a href="mailto:support@sukhira.in" style={{ color: 'var(--color-indigo-600)' }}>support@sukhira.in</a>
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>9. Right to Refuse</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We reserve the right to reject refund claims that are incomplete, untimely, or unsupported by sufficient evidence.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(166, 179, 213, 0.25)', paddingTop: '20px', marginTop: '10px' }}>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>10. Contact Us</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7', margin: 0 }}>
                <strong>Sukhira</strong><br />
                Email: <a href="mailto:support@sukhira.in" style={{ color: 'var(--color-indigo-600)' }}>support@sukhira.in</a><br />
                Website: <a href="http://www.sukhira.in" style={{ color: 'var(--color-indigo-600)' }}>www.sukhira.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
