import React from 'react';

export default function FAQPage() {
  const faqs = [
    { q: 'What is Sukhira?', a: 'Sukhira is a premium wellness brand focused on botanical, calming, and natural products inspired by the beauty of dried flowers and herbal rituals.' },
    { q: 'Where do you ship?', a: 'We currently ship across India, and we may expand to international shipping in the future.' },
    { q: 'How long does delivery take?', a: 'Most orders are delivered within 3 to 10 business days, depending on your location.' },
    { q: 'Do you offer Cash on Delivery?', a: 'If COD is available for your order, it will appear at checkout.' },
    { q: 'Can I cancel my order?', a: 'If your order has not been shipped yet, cancellation may be possible. Once shipped, cancellation may not be possible.' },
    { q: 'Can I return my order?', a: 'Returns are accepted only under eligible cases such as damaged, defective, wrong, or lost products, as described in our refund policy.' },
    { q: 'How do I request a refund?', a: 'Email our support team with your order number, issue details, and supporting photos or videos if required.' },
    { q: 'Are your products natural?', a: 'We aim to offer thoughtfully selected botanical products. Product details and ingredient information are listed on each product page.' },
    { q: 'How do I contact support?', a: 'You can contact us at email: support@sukhira.in or visit our website at www.sukhira.in' },
    { q: 'Are these products medical treatments?', a: 'No. Our products are for general wellness and lifestyle purposes only and are not intended to diagnose, treat, cure, or prevent any disease.' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-indigo-100)', paddingTop: '160px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Support Center</span>
          <h1 className="h1-ds" style={{ fontSize: '42px', color: 'var(--color-indigo-950)', marginTop: '12px', letterSpacing: '-1.5px' }}>Frequently Asked Questions</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              padding: '32px',
              borderRadius: 'var(--border-radius-card)',
              border: '1px solid rgba(166, 179, 213, 0.25)',
              boxShadow: 'var(--shadow-small)'
            }}>
              <h3 className="h3-ds" style={{ fontSize: '18px', color: 'var(--color-indigo-950)', marginBottom: '12px' }}>
                Q: {faq.q}
              </h3>
              <p className="body-ds" style={{ color: 'var(--color-stone-900)', lineHeight: '1.6' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
