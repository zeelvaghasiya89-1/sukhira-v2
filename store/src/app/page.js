import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchStore } from '@/lib/api';

export const revalidate = 0;

function BenefitIcon({ type }) {
  const strokeColor = 'var(--color-indigo-600)';
  const size = 32;
  
  if (type === 'antioxidant') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
        <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
      </svg>
    );
  }
  if (type === 'stress') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3c0 3 3 7 3 7s3-4 3-7a3 3 0 0 0-3-3Z" />
        <path d="M5 21a7 7 0 0 1 14 0" />
        <path d="M12 12s-3-2-6-2-4 2-4 2 2 2 5 2 5-2 5-2Z" />
        <path d="M12 12s3-2 6-2 4 2 4 2-2 2-5 2-5-2-5-2Z" />
      </svg>
    );
  }
  if (type === 'caffeine') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );
  }
  if (type === 'skin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 8 0 4 4 0 0 0-4-4Z" />
        <path d="M12 14a4 4 0 0 0-4 4 4 4 0 0 0 8 0 4 4 0 0 0-4-4Z" />
        <path d="M4 12a4 4 0 0 0 4 4 4 4 0 0 0 0-8 4 4 0 0 0-4 4Z" />
        <path d="M16 12a4 4 0 0 0 4 4 4 4 0 0 0 0-8 4 4 0 0 0-4 4Z" />
      </svg>
    );
  }
  if (type === 'ritual') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8H4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3M21 8h-4v4h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z" />
        <path d="M6 3v2" />
        <path d="M10 3v2" />
        <path d="M14 3v2" />
      </svg>
    );
  }
  if (type === 'color') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7Z" />
        <path d="M8.5 14.5a3.5 3.5 0 0 0 4 0" />
      </svg>
    );
  }
  return null;
}

export default async function HomePage() {
  let featuredProduct = null;
  try {
    const all = await fetchStore('/api/store/products');
    featuredProduct = all.find(p => p.is_featured) || all[0];
  } catch (e) {
    console.error('Failed to load featured product from Express API:', e);
  }

  const benefits = [
    { title: 'Antioxidant Rich', desc: 'Packed with anthocyanins that combat oxidative stress and promote cellular wellness.', icon: 'antioxidant' },
    { title: 'Stress Relief', desc: 'Induces calm and relaxation, helping you unwind naturally after a demanding day.', icon: 'stress' },
    { title: 'Caffeine Free', desc: 'Enjoyable at any hour of the day or night without disrupting your natural sleep cycle.', icon: 'caffeine' },
    { title: 'Healthy Skin & Hair', desc: 'Supports collagen production and skin hydration for a radiant natural glow.', icon: 'skin' },
    { title: 'Mindful Rituals', desc: 'Transforms a simple cup of tea into a moment of intentional slow living.', icon: 'ritual' },
    { title: 'Vibrant Blue Color', desc: '100% natural indigo hue that turns magical purple with a squeeze of lemon.', icon: 'color' }
  ];

  return (
    <div>
      {/* 1. Hero Section (Primary Dark Background) */}
      <section style={{
        position: 'relative',
        height: '90vh',
        minHeight: '650px',
        display: 'flex',
        alignItems: 'center',
        color: '#F5F7FC',
        overflow: 'hidden',
        backgroundColor: '#1B2340'
      }}>
        {/* Background Image Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          backgroundColor: '#1B2340'
        }}>
          <Image 
            src="/images/hero_banner.png"
            alt="Sukhira Tea Gardens"
            fill
            style={{ objectFit: 'cover', opacity: '0.45' }}
            priority
          />
        </div>

        <div className="container" style={{ zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: '640px' }} className="animate-slide-up">
            <span className="caption-ds" style={{
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--color-accent-chamomile)',
              display: 'inline-block',
              marginBottom: '16px'
            }}>Simple Wellness, Thoughtfully Crafted</span>
            <h1 className="display-lg" style={{
              marginBottom: '24px',
              fontWeight: '500',
              letterSpacing: '-1.5px',
              color: '#ffffff'
            }}>Find Your Calm, One Cup at a Time.</h1>
            <p className="body-large" style={{
              marginBottom: '40px',
              color: 'var(--color-indigo-200)'
            }}>
              Discover premium, 100% natural herbal teas designed to transform your daily routine into a calming ritual.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '16px' }}>
              <Link href="/shop" className="btn btn-primary">
                Shop Collection
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Pitch / Story Teaser (Light Section for Visual Contrast Rhythm) */}
      <section className="section" style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        color: 'var(--color-indigo-950)', 
        borderTop: '1px solid var(--color-indigo-200)',
        borderBottom: '1px solid var(--color-indigo-200)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 80px auto' }}>
            <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '12px' }}>The Brand Ethos</span>
            <h2 className="h2-ds" style={{ marginBottom: '24px', letterSpacing: '-0.5px', color: 'var(--color-indigo-950)' }}>Why Sukhira Exists</h2>
            <p className="body-large" style={{ color: 'var(--color-indigo-900)' }}>
              Modern life is busy, stressful, and constantly connected. Sukhira exists to create moments of calm. We believe wellness doesn't need to be complicated—nature already provides the perfect ingredients. Our role is to present them in an honest, beautiful, and premium way.
            </p>
          </div>

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
                src="/images/lifestyle_flatlay.png"
                alt="Sukhira Tea Ceremony"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <span className="caption-ds" style={{ color: 'var(--color-indigo-700)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>Slow Brew Ritual</span>
              <h3 className="h3-ds" style={{ marginBottom: '24px', color: 'var(--color-indigo-950)' }}>The Daily Blue Tea Ritual</h3>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '20px' }}>
                Crafted using whole-flower Butterfly Pea blossoms, our Blue Tea is more than a beverage—it's a visual, sensory mindfulness practice. Watch the deep blue infusion swirl in your cup. Squeeze a lemon slice and see the natural blue change to a vibrant purple before your eyes. 
              </p>
              <p className="body-ds" style={{ color: 'var(--color-indigo-900)', marginBottom: '40px' }}>
                A few minutes of slow brewing, inhaling the earthy botanical notes, and sipping in silence can restore your focus and bring calm to a busy day.
              </p>
              <Link href="/shop/butterfly-pea-tea" className="btn btn-ghost" style={{ border: '1px solid var(--color-indigo-950)', color: 'var(--color-indigo-950)' }}>
                Discover Butterfly Pea Tea
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Product Highlight (Secondary Dark Section) */}
      {featuredProduct && (
        <section className="section" style={{ backgroundColor: 'var(--color-indigo-900)', borderBottom: '1px solid var(--color-indigo-800)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="caption-ds" style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-indigo-300)', letterSpacing: '1px' }}>Signature Blend</span>
              <h2 className="h2-ds" style={{ marginTop: '12px', color: '#ffffff' }}>Our Launch Product</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'center'
            }} className="grid-2-col">
              <div className="responsive-image-container tall" style={{ 
                position: 'relative', 
                borderRadius: 'var(--border-radius-image)', 
                overflow: 'hidden', 
                backgroundColor: 'var(--color-indigo-950)',
                boxShadow: 'var(--shadow-medium)'
              }}>
                <Image 
                  src={featuredProduct.image_url}
                  alt={featuredProduct.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="h3-ds" style={{ marginBottom: '16px', color: '#ffffff' }}>{featuredProduct.name}</h3>
                <p style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-indigo-200)', marginBottom: '28px' }}>
                  Starting at ₹{featuredProduct.base_price}
                </p>
                <p className="body-ds" style={{ color: 'var(--color-indigo-200)', marginBottom: '36px', lineHeight: '1.7' }}>
                  {featuredProduct.description}
                </p>
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: '#ffffff' }}>Key Highlights</h4>
                  <ul style={{ paddingLeft: '0', listStyle: 'none', color: 'var(--color-indigo-200)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '15px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> 100% Whole Flowers
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> Sourced with Integrity
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> Rich in Antioxidants
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> Caffeine-Free
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> No Artificial Additives
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-indigo-400)' }}></span> Eco-Friendly Packaging
                    </li>
                  </ul>
                </div>
                <Link href={`/shop/${featuredProduct.slug}`} className="btn btn-secondary">
                  View Pack Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Benefits Grid (Light Section with White Cards for Beautiful contrast) */}
      <section className="section" style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        borderTop: '1px solid var(--color-indigo-200)',
        borderBottom: '1px solid var(--color-indigo-200)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 80px auto' }}>
            <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Taxonomy of Wellness</span>
            <h2 className="h2-ds" style={{ marginTop: '12px', marginBottom: '20px', color: 'var(--color-indigo-950)' }}>The Power of Nature</h2>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)' }}>
              Every cup of Sukhira tea is packed with pure, organic goodness that supports your physical and mental wellness.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }} className="grid-3-col">
            {benefits.map((benefit, i) => (
              <div key={i} style={{
                backgroundColor: '#ffffff',
                padding: '40px 32px',
                borderRadius: 'var(--border-radius-card)',
                border: '1px solid rgba(166, 179, 213, 0.25)',
                boxShadow: 'var(--shadow-small)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ marginBottom: '24px', display: 'block' }}><BenefitIcon type={benefit.icon} /></div>
                <h3 className="h3-ds" style={{ fontSize: '20px', marginBottom: '14px', color: 'var(--color-indigo-950)' }}>{benefit.title}</h3>
                <p className="small-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonial Ethereal Banner */}
      <section className="section" style={{
        position: 'relative',
        color: '#F5F7FC',
        textAlign: 'center',
        overflow: 'hidden',
        backgroundColor: '#28345A',
        borderTop: '1px solid rgba(166, 179, 213, 0.15)',
        borderBottom: '1px solid rgba(166, 179, 213, 0.15)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
        }}>
          <Image 
            src="/images/testimonial_bg.png"
            alt="Testimonial background"
            fill
            style={{ objectFit: 'cover', opacity: '0.25' }}
          />
        </div>

        <div className="container" style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '20px', color: 'var(--color-accent-chamomile)', display: 'block', marginBottom: '24px', letterSpacing: '4px' }}>★★★★★</span>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontStyle: 'italic',
            lineHeight: '1.5',
            marginBottom: '32px',
            color: '#ffffff'
          }}>
            "Sukhira Blue Tea has become my favorite evening ritual. The deep blue color is mesmerizing, and adding lemon is like a little piece of art at the end of a hectic workday. It truly helps me slow down."
          </p>
          <h4 className="caption-ds" style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', color: 'var(--color-indigo-300)' }}>
            Aisha M., Working Professional
          </h4>
        </div>
      </section>
    </div>
  );
}
