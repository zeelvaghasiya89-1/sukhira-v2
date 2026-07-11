"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--admin-muted)' }}>Loading product collection...</div>;
  }

  return (
    <div>
      {/* Header section with Action button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <p style={{ color: 'var(--admin-muted)', fontSize: '14px' }}>Add and manage your e-commerce product catalog and variants</p>
        </div>
        <Link href="/products/new" className="admin-btn admin-btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--admin-muted)', marginBottom: '20px' }}>No products found in the catalog.</p>
          <Link href="/products/new" className="admin-btn admin-btn-primary">
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Variants Count</th>
                <th>Total Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + v.stock, 0) : 0;
                const variantsCount = p.variants ? p.variants.length : 0;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid var(--admin-border)'
                      }}>
                        <Image 
                          src={p.image_url || '/images/hero_product.png'}
                          alt={p.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {p.name}
                      {p.is_featured === 1 && (
                        <span className="badge badge-featured" style={{ marginLeft: '8px', fontSize: '9px' }}>Featured</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--admin-muted)' }}>{p.slug}</td>
                    <td><span style={{ textTransform: 'capitalize' }}>{p.category.replace('-', ' ')}</span></td>
                    <td style={{ fontWeight: '600' }}>{formatCurrency(p.base_price)}</td>
                    <td>{variantsCount}</td>
                    <td>
                      <span style={{
                        fontWeight: '600',
                        color: totalStock === 0 ? 'var(--admin-danger)' : 'inherit'
                      }}>
                        {totalStock} units
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.is_active === 1 ? 'status-badge-confirmed' : 'status-badge-cancelled'}`}>
                        {p.is_active === 1 ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/products/${p.id}`} className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
