"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductForm() {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'herbal-tea',
    base_price: 299,
    compare_at_price: 399,
    image_url: '/images/hero_product.png',
    is_featured: 0,
    is_active: 1,
    benefits: [],
    brewing_instructions: {
      temp: '90-95°C',
      time: '3-5 minutes',
      amount: '1 tsp per cup',
      steps: []
    }
  });

  // Default initial variants for a tea product
  const [variants, setVariants] = useState([
    { name: '30g Eco-Pouch', sku: 'SUK-TEA-30G', price: 299, compare_at_price: 399, stock: 50 },
    { name: '50g Premium Tin', sku: 'SUK-TEA-50G', price: 449, compare_at_price: 599, stock: 50 }
  ]);

  const [stepInput, setStepInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            fileName: file.name,
            fileType: file.type
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setProduct(prev => ({ ...prev, image_url: data.url }));
        } else {
          alert(data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  // Generate slug from product name automatically
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setProduct({ ...product, name, slug });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', sku: '', price: 299, compare_at_price: null, stock: 10 }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      alert('A product must have at least one variant.');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const addStep = () => {
    if (!stepInput) return;
    setProduct({
      ...product,
      brewing_instructions: {
        ...product.brewing_instructions,
        steps: [...product.brewing_instructions.steps, stepInput]
      }
    });
    setStepInput('');
  };

  const addBenefit = () => {
    if (!benefitInput) return;
    setProduct({
      ...product,
      benefits: [...product.benefits, benefitInput]
    });
    setBenefitInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, variants })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/products');
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--admin-muted)' }}>
        <Link href="/products">Products</Link> / <span>Add New Product</span>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)', padding: '16px', borderRadius: '6px', marginBottom: '24px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Card 1: Basic Info */}
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
            Basic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Name</label>
              <input type="text" className="form-input" value={product.name} onChange={handleNameChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Slug</label>
              <input type="text" className="form-input" value={product.slug} onChange={(e) => setProduct({ ...product, slug: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}>
                <option value="herbal-tea">Herbal Tea</option>
                <option value="wellness">Wellness</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Base Price (₹)</label>
              <input type="number" className="form-input" value={product.base_price} onChange={(e) => setProduct({ ...product, base_price: parseFloat(e.target.value) })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Image URL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="form-input" value={product.image_url} onChange={(e) => setProduct({ ...product, image_url: e.target.value })} required style={{ flex: 1 }} />
                <label className="admin-btn admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0 12px', margin: 0, fontSize: '13px', whiteSpace: 'nowrap' }}>
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" checked={product.is_active === 1} onChange={(e) => setProduct({ ...product, is_active: e.target.checked ? 1 : 0 })} />
              Active storefront listing
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" checked={product.is_featured === 1} onChange={(e) => setProduct({ ...product, is_featured: e.target.checked ? 1 : 0 })} />
              Featured product on home page
            </label>
          </div>
        </div>

        {/* Card 2: Variants */}
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Product Variants</h3>
            <button type="button" onClick={addVariant} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              + Add Variant
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {variants.map((v, index) => (
              <div 
                key={index} 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'end',
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '6px'
                }}
              >
                <div>
                  <label className="form-label">Variant Name</label>
                  <input type="text" className="form-input" value={v.name} placeholder="e.g. 50g Tin" onChange={(e) => handleVariantChange(index, 'name', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">SKU</label>
                  <input type="text" className="form-input" value={v.sku} placeholder="SUK-BPT-50G" onChange={(e) => handleVariantChange(index, 'sku', e.target.value.toUpperCase())} required />
                </div>
                <div>
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" value={v.price} onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))} required />
                </div>
                <div>
                  <label className="form-label">Compare (₹)</label>
                  <input type="number" className="form-input" value={v.compare_at_price || ''} onChange={(e) => handleVariantChange(index, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : null)} />
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-input" value={v.stock} onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))} required />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  style={{ color: 'var(--admin-danger)', fontSize: '20px', padding: '8px', cursor: 'pointer' }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Benefits & Brewing Instructions */}
        <div className="admin-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
            Benefits & Brewing Guide
          </h3>

          {/* Benefits */}
          <div style={{ marginBottom: '30px' }}>
            <label className="form-label">Product Benefits</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <input type="text" className="form-input" placeholder="e.g. Rich in Antioxidants" value={benefitInput} onChange={(e) => setBenefitInput(e.target.value)} />
              <button type="button" onClick={addBenefit} className="admin-btn admin-btn-secondary">Add</button>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--admin-muted)' }}>
              {product.benefits.map((b, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>✓ {b}</span>
                  <button 
                    type="button" 
                    onClick={() => setProduct({ ...product, benefits: product.benefits.filter((_, idx) => idx !== i) })}
                    style={{ color: 'var(--admin-danger)', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brewing Guide parameters */}
          <div style={{
            borderTop: '1px solid var(--admin-border)',
            paddingTop: '20px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Brewing Guide Settings</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Water Temp</label>
                <input type="text" className="form-input" value={product.brewing_instructions.temp} onChange={(e) => setProduct({
                  ...product,
                  brewing_instructions: { ...product.brewing_instructions, temp: e.target.value }
                })} />
              </div>
              <div>
                <label className="form-label">Steep Time</label>
                <input type="text" className="form-input" value={product.brewing_instructions.time} onChange={(e) => setProduct({
                  ...product,
                  brewing_instructions: { ...product.brewing_instructions, time: e.target.value }
                })} />
              </div>
              <div>
                <label className="form-label">Tea Amount</label>
                <input type="text" className="form-input" value={product.brewing_instructions.amount} onChange={(e) => setProduct({
                  ...product,
                  brewing_instructions: { ...product.brewing_instructions, amount: e.target.value }
                })} />
              </div>
            </div>

            {/* Steps */}
            <div>
              <label className="form-label">Brewing Steps</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input type="text" className="form-input" placeholder="e.g. Steep for 3-5 minutes" value={stepInput} onChange={(e) => setStepInput(e.target.value)} />
                <button type="button" onClick={addStep} className="admin-btn admin-btn-secondary">Add Step</button>
              </div>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--admin-muted)' }}>
                {product.brewing_instructions.steps.map((step, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{step}</span>
                    <button 
                      type="button" 
                      onClick={() => setProduct({
                        ...product,
                        brewing_instructions: {
                          ...product.brewing_instructions,
                          steps: product.brewing_instructions.steps.filter((_, i) => i !== idx)
                        }
                      })}
                      style={{ color: 'var(--admin-danger)', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'end', marginBottom: '60px' }}>
          <Link href="/products" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ padding: '10px 30px' }}
          >
            {loading ? 'Creating...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
