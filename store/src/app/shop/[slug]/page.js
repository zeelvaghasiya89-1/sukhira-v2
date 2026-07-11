import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchStore } from '@/lib/api';
import ProductInfo from '@/components/product/ProductInfo';
import PHVisualizer from '@/components/product/PHVisualizer';

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  
  let product = null;
  try {
    product = await fetchStore(`/api/store/products/${slug}`);
  } catch (e) {
    console.error('Failed to get product from SQLite:', e);
  }

  if (!product) {
    notFound();
  }

  // Choose the gallery images (fallback to main image if empty)
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/images/hero_product.png'];

  const isBlueTea = slug === 'butterfly-pea-tea';

  return (
    <div style={{ backgroundColor: 'var(--color-indigo-950)', minHeight: '100vh' }}>
      
      {/* SECTION 1: Product Presentation (Light Off-White Section for Contrast) */}
      <div style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        paddingTop: '160px',
        paddingBottom: '80px',
        borderBottom: '1px solid var(--color-indigo-200)'
      }}>
        <div className="container">
          {/* Breadcrumb navigation */}
          <div className="caption-ds" style={{ marginBottom: '40px', color: 'var(--color-indigo-700)', fontWeight: '500' }}>
            <Link href="/" style={{ color: 'var(--color-indigo-700)' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/shop" style={{ color: 'var(--color-indigo-700)' }}>Shop</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--color-indigo-950)' }}>{product.name}</span>
          </div>

          {/* Product Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '64px',
            alignItems: 'start'
          }} className="product-layout-grid">
            
            {/* Column 1: Image Gallery */}
            <div>
              {/* Main Image */}
              <div style={{ 
                position: 'relative', 
                aspectRatio: '1', 
                borderRadius: 'var(--border-radius-image)', 
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(166, 179, 213, 0.25)',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-small)'
              }}>
                <Image 
                  src={images[0]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Thumbnails (if multiple images exist) */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  {images.map((img, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(166, 179, 213, 0.25)',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <Image 
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Product purchasing details */}
            <div>
              <h1 className="h1-ds" style={{ fontSize: '42px', color: 'var(--color-indigo-950)', marginBottom: '12px', letterSpacing: '-1px' }}>{product.name}</h1>
              <div className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px' }}>
                Category: {product.category === 'herbal-tea' ? 'Herbal Tea' : product.category}
              </div>

              {/* Interactive Selector & Buy Component */}
              <ProductInfo product={product} />

              {/* Description */}
              <div style={{ borderTop: '1px solid rgba(166, 179, 213, 0.25)', paddingTop: '30px', marginTop: '30px' }}>
                <h3 className="h3-ds" style={{ fontSize: '18px', color: 'var(--color-indigo-950)', marginBottom: '16px' }}>Description</h3>
                <p className="body-ds" style={{ color: 'var(--color-indigo-900)', lineHeight: '1.7' }}>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Health Benefits & Brewing Details (Dark Indigo Section for Contrast) */}
      <div style={{ 
        padding: '96px 0',
        backgroundColor: 'var(--color-indigo-950)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '64px'
          }} className="product-info-grid">
            
            {/* Column 1: Benefits */}
            <div>
              <h3 className="h3-ds" style={{ fontSize: '24px', color: '#ffffff', marginBottom: '24px' }}>Key Health Benefits</h3>
              {product.benefits && product.benefits.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', paddingLeft: 0 }}>
                  {product.benefits.map((benefit, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '15px', color: 'var(--color-indigo-200)' }}>
                      <span style={{ color: 'var(--color-accent-pea)', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                      <span className="body-ds">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-ds" style={{ color: 'var(--color-indigo-300)' }}>No highlights listed.</p>
              )}
            </div>

            {/* Column 2: Brewing Guide */}
            <div style={{
              backgroundColor: 'var(--color-indigo-900)',
              padding: '40px',
              borderRadius: 'var(--border-radius-card)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'var(--shadow-small)'
            }}>
              <h3 className="h3-ds" style={{ fontSize: '24px', color: '#ffffff', marginBottom: '24px' }}>How to Brew</h3>
              
              {product.brewing_instructions && Object.keys(product.brewing_instructions).length > 0 ? (
                <div>
                  {/* Visual parameters */}
                  <div style={{
                    display: 'flex',
                    gap: '40px',
                    marginBottom: '32px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '24px'
                  }}>
                    <div>
                      <span className="caption-ds" style={{ color: 'var(--color-indigo-300)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Temp</span>
                      <span style={{ fontWeight: '600', fontSize: '18px', color: 'var(--color-indigo-100)' }}>{product.brewing_instructions.temp}</span>
                    </div>
                    <div>
                      <span className="caption-ds" style={{ color: 'var(--color-indigo-300)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Steep Time</span>
                      <span style={{ fontWeight: '600', fontSize: '18px', color: 'var(--color-indigo-100)' }}>{product.brewing_instructions.time}</span>
                    </div>
                    <div>
                      <span className="caption-ds" style={{ color: 'var(--color-indigo-300)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Amount</span>
                      <span style={{ fontWeight: '600', fontSize: '18px', color: 'var(--color-indigo-100)' }}>{product.brewing_instructions.amount}</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--color-indigo-200)' }}>
                    {product.brewing_instructions.steps.map((step, idx) => (
                      <li key={idx} style={{ lineHeight: '1.6' }} className="small-ds">{step}</li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="body-ds" style={{ color: 'var(--color-indigo-300)' }}>Brewing instructions coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Interactive Chemistry Visualizer (Light Off-White Section for Contrast) */}
      {isBlueTea && (
        <div style={{ 
          backgroundColor: 'var(--color-indigo-100)', 
          padding: '80px 0',
          borderTop: '1px solid var(--color-indigo-200)'
        }}>
          <div className="container">
            <PHVisualizer />
          </div>
        </div>
      )}

    </div>
  );
}
