import React from 'react';

export default function PrivacyPolicyPage() {
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
          <h1 className="h1-ds" style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--color-indigo-950)', letterSpacing: '-1px' }}>Privacy Policy</h1>
          <p className="caption-ds" style={{ color: 'var(--color-indigo-600)', marginBottom: '36px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Effective Date: July 11, 2026</p>
          
          <div className="policy-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
              Sukhira (“we”, “our”, “us”) respects your privacy and is committed to protecting the personal information you share with us when you visit our website, place an order, contact us, or otherwise interact with our services.
            </p>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>1. Information We Collect</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>We may collect the following information:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping address</li>
                <li>Payment-related details processed by our payment partners</li>
                <li>Order history</li>
                <li>Device, browser, and usage information</li>
                <li>Any information you choose to share with us through forms, email, WhatsApp, or support channels</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>2. How We Use Your Information</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '12px' }}>We use your information to:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-indigo-900)' }}>
                <li>Process and fulfill orders</li>
                <li>Communicate with you about your order, shipping, and support</li>
                <li>Provide customer service</li>
                <li>Improve our website, products, and user experience</li>
                <li>Send promotional messages, if you have opted in</li>
                <li>Prevent fraud and misuse</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>3. Sharing of Information</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We do not sell your personal information. We may share information only with trusted service providers when necessary to operate our business, including payment processors, shipping/logistics partners, analytics providers, and support tools. These third parties are expected to use your information only for the services they provide to us.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>4. Cookies and Tracking</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Our website may use cookies to remember your preferences, analyze website traffic, and improve site performance. You can manage cookies through your browser settings, but some parts of the website may not function properly if cookies are disabled.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>5. Data Security</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We take reasonable technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>6. Data Retention</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We keep personal information only for as long as necessary to provide our services, complete transactions, resolve disputes, comply with legal obligations, and maintain records as required.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>7. Your Rights</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Depending on applicable law, you may have rights to access your personal information, correct inaccurate information, request deletion of certain information, or withdraw consent for marketing communications. To exercise these rights, contact us using the details below.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>8. Third-Party Links</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices, content, or security of such external websites.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>9. Children's Privacy</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                Our website and products are not intended for children under 18, and we do not knowingly collect personal information from children.
              </p>
            </div>

            <div>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>10. Changes to This Policy</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(166, 179, 213, 0.25)', paddingTop: '20px', marginTop: '10px' }}>
              <h2 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>11. Contact Us</h2>
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
