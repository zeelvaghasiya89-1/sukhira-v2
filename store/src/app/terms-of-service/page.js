import React from 'react';

export default function TermsOfServicePage() {
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
          <h1 className="h1-ds" style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--color-indigo-950)', letterSpacing: '-1px' }}>Terms of Service</h1>
          <p className="caption-ds" style={{ color: 'var(--color-indigo-600)', marginBottom: '36px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Effective Date: July 11, 2026</p>
          
          <div className="policy-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
              Welcome to Sukhira. By accessing or using our website, you agree to these Terms of Service. If you do not agree, please do not use our website or place an order.
            </p>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>1. Eligibility</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                By using our website, you confirm that you are at least 18 years old or are using the website under the supervision of a parent or legal guardian.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>2. Website Use</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>You agree not to:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>Use the website for unlawful purposes</li>
                <li>Interfere with the website’s operation or security</li>
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Attempt to access restricted areas or data</li>
                <li>Place false, fraudulent, or abusive orders</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>3. Product Information</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We make every effort to display product details, descriptions, prices, images, and availability accurately. However, slight variations may occur due to lighting, screen settings, packaging updates, or batch differences.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>4. Orders and Acceptance</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                An order placed on our website is an offer to purchase. We reserve the right to accept, reject, or cancel any order for reasons including product availability, pricing errors, suspected fraud, or shipping limitations.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>5. Pricing</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                All prices are shown in Indian Rupees unless stated otherwise. Prices may change at any time without prior notice. Taxes, shipping charges, and other applicable fees may be added at checkout.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>6. Payments</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Payments may be made through the payment methods available at checkout. By submitting payment details, you confirm that you are authorized to use the selected payment method.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>7. Intellectual Property</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                All content on this website, including text, images, logos, product names, graphics, and design elements, belongs to Sukhira or its licensors and is protected by applicable intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>8. User Submissions</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                If you send reviews, feedback, suggestions, or other content to us, you grant us the right to use, reproduce, and display that content for business purposes unless prohibited by law.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>9. Limitation of Liability</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                To the fullest extent permitted by law, Sukhira is not responsible for indirect, incidental, special, or consequential damages arising from your use of the website or products.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>10. Disclaimer</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Our products are intended for general wellness and lifestyle use. They are not intended to diagnose, treat, cure, or prevent any disease. Any information on the website is for general informational purposes only and should not replace professional advice.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>11. Governing Law</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                These Terms of Service are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in Ahmedabad, Gujarat, India, unless otherwise required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>12. Changes to These Terms</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We may update these Terms of Service from time to time. Continued use of the website after changes are posted means you accept the revised terms.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(166, 179, 213, 0.25)', paddingTop: '20px', marginTop: '10px' }}>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>13. Contact Us</h2>
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
