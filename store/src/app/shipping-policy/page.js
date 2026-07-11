import React from 'react';

export default function ShippingPolicyPage() {
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
          <h1 className="h1-ds" style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--color-indigo-950)', letterSpacing: '-1px' }}>Shipping Policy</h1>
          <p className="caption-ds" style={{ color: 'var(--color-indigo-600)', marginBottom: '36px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Effective Date: July 11, 2026</p>
          
          <div className="policy-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
              This Shipping Policy explains how Sukhira processes and delivers orders placed on our website.
            </p>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>1. Order Processing Time</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Orders are usually processed within 1 to 3 business days after payment confirmation. Processing time may increase during launches, sales, holidays, or other busy periods.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>2. Delivery Timeline</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>Estimated delivery times depend on the delivery location and courier service. In general:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>Metro cities: 3 to 7 business days</li>
                <li>Other locations: 5 to 10 business days</li>
                <li>Remote or hard-to-reach areas: 7 to 14 business days</li>
              </ul>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginTop: '12px', lineHeight: '1.7' }}>
                These timelines are estimates only and may vary due to courier delays, weather conditions, strikes, peak seasons, or other factors beyond our control.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>3. Shipping Charges</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Shipping charges, if applicable, will be shown at checkout before you complete payment. We may offer free shipping on certain orders, locations, or promotional campaigns.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>4. Cash on Delivery</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                If COD is available for your order, any COD fee or eligibility condition will be clearly shown at checkout. COD orders may be subject to confirmation before dispatch.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>5. Order Tracking</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Once your order is shipped, we will share tracking details by email, SMS, or WhatsApp, where available.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>6. Delivery Attempts</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Courier partners may make multiple delivery attempts. If the package is refused, undelivered, or returned due to an incorrect address, unreachable phone number, or customer non-availability, re-shipping charges may apply.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>7. Address Accuracy</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Please make sure your shipping address, phone number, and pin code are correct. We are not responsible for delays or failed deliveries caused by incorrect or incomplete address details.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>8. Damaged or Lost Shipments</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                If your order arrives damaged or appears lost in transit, contact us as soon as possible with your order number and evidence so we can investigate.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>9. Delays</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Delivery timelines are estimates, not guarantees. We are not liable for delays caused by courier partners, customs, public holidays, weather, operational issues, or force majeure events.
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
