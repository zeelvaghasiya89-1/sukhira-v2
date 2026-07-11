"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to establish connection. Check your network.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'Is the blue color in the tea natural?', a: 'Yes! The vibrant blue color comes entirely from the natural pigments (anthocyanins) in the Butterfly Pea Flower petals. There are absolutely no artificial food colors or additives in our tea.' },
    { q: 'Why does the tea change color from blue to purple?', a: 'Butterfly Pea Flower tea is a natural pH indicator. When you introduce an acidic ingredient like fresh lemon or lime juice, it alters the pH level, magically shifting the color from deep blue to bright violet-purple.' },
    { q: 'Where do you ship to?', a: 'Currently, we ship all across India. Delivery times range from 3-5 business days for major metropolitan areas and 5-7 business days for other regions.' },
    { q: 'Does this tea contain caffeine?', a: 'No, our Butterfly Pea Flower Tea is 100% caffeine-free, making it the perfect herbal infusion to drink at night before sleep or at any time you want to wind down.' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-indigo-950)', minHeight: '100vh' }}>
      
      {/* 1. Form & Contact details (Light Off-White Section for Contrast) */}
      <div style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        paddingTop: '160px',
        paddingBottom: '80px',
        borderBottom: '1px solid var(--color-indigo-200)'
      }}>
        <div className="container">
          <h1 className="h1-ds" style={{ textAlign: 'center', marginBottom: '50px', color: 'var(--color-indigo-950)', letterSpacing: '-1.5px' }}>Get in Touch</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '64px',
            alignItems: 'start'
          }} className="contact-grid">
            
            {/* Form Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius-card)',
              border: '1px solid rgba(166, 179, 213, 0.25)',
              padding: '40px',
              boxShadow: 'var(--shadow-small)'
            }}>
              <h2 className="h3-ds" style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--color-indigo-950)' }}>Send us a Message</h2>
              {submitted && (
                <div style={{
                  backgroundColor: 'var(--color-indigo-950)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-medium)'
                }}>
                  ✓ Thank you! Your message has been sent. We'll get back to you shortly.
                </div>
              )}
              {error && (
                <div style={{
                  backgroundColor: 'var(--color-error)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-medium)'
                }}>
                  ✕ {error}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Your Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                    disabled={loading}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-indigo-300)',
                      color: 'var(--color-indigo-950)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                    disabled={loading}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-indigo-300)',
                      color: 'var(--color-indigo-950)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Subject</label>
                  <input 
                    type="text" 
                    value={form.subject} 
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                    required 
                    disabled={loading}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-indigo-300)',
                      color: 'var(--color-indigo-950)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--color-indigo-950)' }}>Message</label>
                  <textarea 
                    rows="5" 
                    value={form.message} 
                    onChange={(e) => setForm({ ...form, message: e.target.value })} 
                    required
                    disabled={loading}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-indigo-300)',
                      color: 'var(--color-indigo-950)'
                    }}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary" 
                  style={{ 
                    padding: '16px 0', 
                    backgroundColor: 'var(--color-indigo-950)', 
                    color: '#ffffff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Sending Message...' : 'Submit Message'}
                </button>
              </form>
            </div>

            {/* Details */}
            <div style={{ paddingTop: '20px' }}>
              <h2 className="h3-ds" style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--color-indigo-950)' }}>Contact Information</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '32px', lineHeight: '1.7' }}>
                Have questions about our sourcing, bulk orders, or brand partnerships? Feel free to drop us a line. We try to respond to all inquiries within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontSize: '24px', color: 'var(--color-indigo-600)' }}>✉</span>
                  <div>
                    <h4 className="caption-ds" style={{ fontWeight: '600', color: 'var(--color-indigo-950)' }}>Email</h4>
                    <a href="mailto:info@sukhira.in" style={{ color: 'var(--color-indigo-600)', fontSize: '15px', fontWeight: '500' }}>info@sukhira.in</a>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontSize: '24px', color: 'var(--color-indigo-600)' }}>📍</span>
                  <div>
                    <h4 className="caption-ds" style={{ fontWeight: '600', color: 'var(--color-indigo-950)' }}>Office</h4>
                    <p style={{ color: 'var(--color-indigo-900)', fontSize: '15px', lineHeight: '1.6' }}>
                      Sukhira Wellness,<br />
                      Katargam, Surat, Gujarat, India - 395004
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FAQs Section (Dark Indigo Section for Contrast) */}
      <div style={{ 
        padding: '96px 0',
        backgroundColor: 'var(--color-indigo-950)'
      }}>
        <div className="container">
          <h2 className="h2-ds" style={{ textAlign: 'center', marginBottom: '48px', color: '#ffffff' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                backgroundColor: 'var(--color-indigo-900)',
                padding: '30px',
                borderRadius: 'var(--border-radius-card)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'var(--shadow-small)'
              }}>
                <h3 className="h3-ds" style={{ fontSize: '18px', marginBottom: '12px', color: '#ffffff' }}>
                  Q: {faq.q}
                </h3>
                <p className="body-ds" style={{ color: 'var(--color-indigo-200)', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
