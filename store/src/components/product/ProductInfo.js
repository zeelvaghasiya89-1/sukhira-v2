"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const variants = product.variants || [];
  
  // Set default selected variant
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  if (!selectedVariant) {
    return <p style={{ color: 'var(--color-indigo-700)' }}>Variants not available.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2000);
  };

  const hasComparePrice = selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price;
  const isOutOfStock = selectedVariant.stock <= 0;

  return (
    <div>
      {/* Pricing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        {hasComparePrice && (
          <span style={{
            textDecoration: 'line-through',
            color: 'var(--color-indigo-600)',
            fontSize: '22px',
            fontWeight: '400'
          }}>
            ₹{selectedVariant.compare_at_price}
          </span>
        )}
        <span style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'var(--color-indigo-950)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.5px'
        }}>
          ₹{selectedVariant.price}
        </span>
        {hasComparePrice && (
          <span className="badge" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', backgroundColor: 'rgba(181, 82, 82, 0.12)', color: 'var(--color-error)' }}>
            Save {Math.round(((selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price) * 100)}%
          </span>
        )}
      </div>

      {/* Select Variant Size */}
      <div style={{ marginBottom: '36px' }}>
        <h4 className="caption-ds" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', color: 'var(--color-indigo-950)' }}>
          Select Size
        </h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {variants.map((v) => {
            const isSelected = selectedVariant.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v);
                  setQuantity(1); // reset quantity when variant changes
                }}
                style={{
                  border: isSelected ? '1px solid var(--color-indigo-950)' : '1px solid var(--color-indigo-300)',
                  backgroundColor: isSelected ? 'var(--color-indigo-950)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--color-indigo-950)',
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  fontWeight: isSelected ? '600' : '500',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-small)'
                }}
              >
                {v.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Stock Status */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 className="caption-ds" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-indigo-950)' }}>
            Quantity
          </h4>
          {selectedVariant.stock > 0 ? (
            <span className="caption-ds" style={{ 
              color: selectedVariant.stock <= selectedVariant.low_stock_threshold ? 'var(--color-error)' : 'var(--color-success)',
              fontWeight: '600'
            }}>
              {selectedVariant.stock <= selectedVariant.low_stock_threshold 
                ? `Only ${selectedVariant.stock} left in stock!` 
                : '✓ Batch In Stock'}
            </span>
          ) : (
            <span className="caption-ds" style={{ color: 'var(--color-error)', fontWeight: '600' }}>
              ✕ Out of Stock
            </span>
          )}
        </div>

        <div className="purchase-controls" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Quantity Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--color-indigo-300)',
            borderRadius: '9999px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-small)'
          }}>
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              style={{ padding: '12px 20px', fontSize: '18px', color: 'var(--color-indigo-600)', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ padding: '0 4px', minWidth: '36px', textAlign: 'center', fontWeight: '600', color: 'var(--color-indigo-950)' }}>
              {isOutOfStock ? 0 : quantity}
            </span>
            <button 
              onClick={() => setQuantity(q => Math.min(selectedVariant.stock, q + 1))}
              disabled={quantity >= selectedVariant.stock || isOutOfStock}
              style={{ padding: '12px 20px', fontSize: '18px', color: 'var(--color-indigo-600)', cursor: 'pointer' }}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{ 
              flex: 1, 
              padding: '16px 0', 
              backgroundColor: 'var(--color-indigo-950)', 
              color: '#ffffff',
              cursor: 'pointer' 
            }}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Ritual'}
          </button>
        </div>
      </div>

      {/* Added Alert */}
      {addedAlert && (
        <div style={{
          backgroundColor: 'var(--color-indigo-950)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '16px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '14px',
          animation: 'fadeInUp 0.3s ease',
          boxShadow: 'var(--shadow-medium)'
        }}>
          ✓ Infusion added to your cart successfully!
        </div>
      )}
    </div>
  );
}
