import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    { title: 'Nature First', desc: 'We source only premium, organic, whole dried flowers. No synthetic sprays, no artificial flavorings, and no fillers.' },
    { title: 'Quality Over Quantity', desc: 'Every single batch undergoes meticulous quality checking. If it does not make a perfect blue brew, it does not leave our doors.' },
    { title: 'Honest Transparency', desc: 'We never exaggerate wellness claims. We believe in educating naturally and speaking with scientific honesty.' },
    { title: 'Intentional Living', desc: 'We design our products to be part of everyday routines, encouraging a moment of pause in a busy world.' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-indigo-950)', minHeight: '100vh' }}>
      
      {/* 1. Hero Header (Light Off-White Section for Contrast) */}
      <section className="section" style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        paddingTop: '160px',
        paddingBottom: '60px',
        borderBottom: '1px solid var(--color-indigo-200)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-indigo-600)', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>Our Story</span>
          <h1 className="h1-ds" style={{ color: 'var(--color-indigo-950)', marginBottom: '24px', letterSpacing: '-1px' }}>Simple wellness, thoughtfully crafted.</h1>
          <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.8' }}>
            Sukhira was created with a simple belief: modern life moves quickly, but wellness doesn't have to be complicated. A few peaceful minutes each day can make a meaningful difference.
          </p>
        </div>
      </section>

      {/* 2. Main Beginnings Content (Dark Indigo Section) */}
      <section className="section" style={{ paddingTop: '80px', paddingBottom: '96px', backgroundColor: 'var(--color-indigo-950)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center'
          }} className="grid-2-col">
            <div className="responsive-image-container" style={{ 
              position: 'relative', 
              borderRadius: 'var(--border-radius-image)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-medium)'
            }}>
              <Image 
                src="/images/about_brand.png"
                alt="Sukhira Craftsmanship"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 className="h2-ds" style={{ color: '#ffffff', marginBottom: '24px' }}>Our Beginnings</h2>
              <p className="body-ds" style={{ color: 'var(--color-indigo-200)', marginBottom: '20px' }}>
                We noticed how challenging it has become for working professionals to maintain calming daily habits. Coffee and energy drinks only amplify the nervous tension, while complex wellness routines feel like chores.
              </p>
              <p className="body-ds" style={{ color: 'var(--color-indigo-200)', marginBottom: '20px' }}>
                We wanted to offer an alternative: a simple, caffeine-free daily ritual that is visually beautiful and calming. We started with premium Butterfly Pea Flower Tea, locally sourced and dried using organic practices.
              </p>
              <p className="body-ds" style={{ color: 'var(--color-indigo-200)' }}>
                This is just the first step in our mission. Sukhira will continue expanding into chamomile, hibiscus, peppermint, and natural wellness products that fit effortlessly into your modern lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid (Light Off-White Section for Contrast) */}
      <section className="section" style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        borderTop: '1px solid var(--color-indigo-200)',
        borderBottom: '1px solid var(--color-indigo-200)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px auto' }}>
            <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Principles</span>
            <h2 className="h2-ds" style={{ color: 'var(--color-indigo-950)', marginTop: '12px', marginBottom: '16px' }}>Our Core Philosophy</h2>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)' }}>
              These are the principles that guide every product choice, partnership, and package design we create.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px'
          }} className="grid-2-col">
            {values.map((v, i) => (
              <div key={i} style={{
                backgroundColor: '#ffffff',
                padding: '40px 32px',
                borderRadius: 'var(--border-radius-card)',
                border: '1px solid rgba(166, 179, 213, 0.25)',
                boxShadow: 'var(--shadow-small)'
              }}>
                <h3 className="h3-ds" style={{ fontSize: '20px', color: 'var(--color-indigo-950)', marginBottom: '14px' }}>
                  {v.title}
                </h3>
                <p className="small-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.6' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
