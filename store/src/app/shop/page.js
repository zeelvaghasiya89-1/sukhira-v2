import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchStore } from '@/lib/api';

export const revalidate = 0;

function getBotanicalDetails(name) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('blue') || lowercaseName.includes('butterfly')) {
    return {
      botanicalName: 'Clitoria ternatea',
      benefit: 'Cognitive Support & Anti-aging',
      accentColor: 'var(--color-accent-pea)'
    };
  }
  if (lowercaseName.includes('chamomile')) {
    return {
      botanicalName: 'Matricaria chamomilla',
      benefit: 'Restful Sleep & Anxiety Relief',
      accentColor: 'var(--color-accent-chamomile)'
    };
  }
  if (lowercaseName.includes('lavender')) {
    return {
      botanicalName: 'Lavandula angustifolia',
      benefit: 'Calm Mind & Muscle Relaxation',
      accentColor: 'var(--color-accent-lavender)'
    };
  }
  return {
    botanicalName: 'L. premium blend',
    benefit: 'General Wellness & Rejuvenation',
    accentColor: 'var(--color-accent-sage)'
  };
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category || '';

  let allProducts = [];
  try {
    allProducts = (await fetchStore('/api/store/products')).filter(p => p.is_active);
    if (activeCategory) {
      allProducts = allProducts.filter(p => 
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        p.slug.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
  } catch (e) {
    console.error('Failed to query products for shop page:', e);
  }

  const filterOptions = [
    { name: 'All Products', value: '' },
    { name: 'Blue Teas', value: 'blue' },
    { name: 'Chamomile', value: 'chamomile' },
    { name: 'Wellness', value: 'tea' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-indigo-950)' }}>
      {/* 1. Header & Filters Section (Light Off-White Section for Contrast) */}
      <div style={{ 
        backgroundColor: 'var(--color-indigo-100)', 
        paddingTop: '160px', 
        paddingBottom: '60px',
        borderBottom: '1px solid var(--color-indigo-200)'
      }}>
        <div className="container">
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="caption-ds" style={{ color: 'var(--color-indigo-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Taxonomy of Infusions</span>
            <h1 className="h1-ds" style={{ marginTop: '12px', marginBottom: '20px', color: 'var(--color-indigo-950)', letterSpacing: '-1px' }}>The Sukhira Dispensary</h1>
            <p className="body-ds" style={{ color: 'var(--color-indigo-900)', maxWidth: '640px', margin: '0 auto' }}>
              Explore our curated selection of premium herbal infusions. Sourced with integrity, blended for scientific wellness, and packaged with care.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {filterOptions.map((opt) => {
              const isSelected = activeCategory === opt.value;
              return (
                <Link
                  key={opt.name}
                  href={opt.value ? `/shop?category=${opt.value}` : '/shop'}
                  style={{
                    border: isSelected ? '1px solid var(--color-indigo-950)' : '1px solid var(--color-indigo-400)',
                    backgroundColor: isSelected ? 'var(--color-indigo-950)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--color-indigo-950)',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {opt.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Products Grid Section (Dark Indigo Section) */}
      <div style={{ padding: '80px 0' }}>
        <div className="container">
          {allProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p className="body-ds" style={{ color: 'var(--color-indigo-300)' }}>No infusions match the selected filter category.</p>
            </div>
          ) : (
            <div className="grid grid-3" style={{ gap: '48px 32px' }}>
              {allProducts.map((product) => {
                const hasComparePrice = product.compare_at_price && product.compare_at_price > product.base_price;
                const hasNoStock = !product.variants || product.variants.every(v => v.stock === 0);
                const { botanicalName, benefit, accentColor } = getBotanicalDetails(product.name);

                return (
                  <div key={product.id} className="product-card" style={{ 
                    border: '1px solid rgba(255, 255, 255, 0.05)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <Link href={`/shop/${product.slug}`}>
                        <div className="product-card-image">
                          <Image 
                            src={product.image_url || '/images/hero_product.png'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {product.is_featured === 1 && (
                            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1 }}>
                              <span className="badge badge-featured">Signature</span>
                            </div>
                          )}
                          {hasComparePrice && (
                            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1 }}>
                              <span className="badge badge-sale">Sale</span>
                            </div>
                          )}
                          {hasNoStock && (
                            <div style={{ 
                              position: 'absolute', 
                              top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: 'rgba(27, 35, 64, 0.85)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2
                            }}>
                              <span style={{ 
                                backgroundColor: 'var(--color-indigo-100)', 
                                color: 'var(--color-indigo-950)', 
                                padding: '8px 18px',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '30px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                              }}>Out of Stock</span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="product-card-content" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: accentColor 
                        }}></span>
                          <span className="product-card-category" style={{ fontSize: '11px', letterSpacing: '1px', margin: 0, color: 'var(--color-indigo-300)' }}>
                            {product.category === 'herbal-tea' ? 'Herbal Tea' : product.category}
                          </span>
                        </div>
                        
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="product-card-title" style={{ fontSize: '22px', fontWeight: '500', color: '#ffffff', margin: '0 0 4px 0' }}>
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p style={{
                          fontSize: '13px',
                          fontStyle: 'italic',
                          color: 'var(--color-indigo-300)',
                          marginBottom: '16px',
                          fontFamily: 'var(--font-serif)'
                        }}>
                          {botanicalName}
                        </p>

                        <div style={{ 
                          borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                          borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
                          padding: '10px 0',
                          marginBottom: '20px'
                        }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-indigo-400)', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>
                            Primary Indicator
                          </span>
                          <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                            {benefit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0 28px 28px 28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-indigo-300)' }}>Price</span>
                        <div className="product-card-price" style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-indigo-100)', margin: 0 }}>
                          {hasComparePrice && (
                            <span className="compare-price">₹{product.compare_at_price}</span>
                          )}
                          <span>₹{product.base_price}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/shop/${product.slug}`} 
                        className="btn btn-ghost btn-block" 
                        style={{ 
                          fontSize: '14px', 
                          padding: '12px 0', 
                          border: '1px solid var(--color-indigo-500)',
                          color: 'var(--color-indigo-100)',
                          backgroundColor: 'transparent'
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
