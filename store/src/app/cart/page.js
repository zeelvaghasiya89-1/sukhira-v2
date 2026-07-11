"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const shippingFreeThreshold = 499;
  const flatShippingRate = 50;

  const isShippingFree = subtotal >= shippingFreeThreshold;
  const shippingCost = subtotal === 0 ? 0 : (isShippingFree ? 0 : flatShippingRate);
  const total = subtotal + shippingCost;

  return (
    <div className="section" style={{ minHeight: '85vh', backgroundColor: '#faf9f6', color: 'var(--color-indigo-950)', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <h1 style={{ fontSize: '38px', marginBottom: '40px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--border-radius)',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1px solid var(--color-indigo-200)',
            boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>🍵</span>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--color-indigo-950)' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--color-indigo-600)', marginBottom: '30px' }}>
              Add some of our premium blends to start your wellness journey.
            </p>
            <Link href="/shop" className="btn btn-primary" style={{ backgroundColor: 'var(--color-indigo-950)', color: '#ffffff' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
            alignItems: 'start'
          }} className="cart-grid">
            
            {/* Column 1: Items List */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-indigo-200)',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)'
            }}>
              {cart.map((item) => (
                <div 
                  key={item.variant_id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px 0',
                    borderBottom: '1px solid var(--color-indigo-100)'
                  }}
                  className="cart-item"
                >
                  {/* Item Image */}
                  <div style={{ 
                    position: 'relative', 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <Image 
                      src={item.image_url || '/images/hero_product.png'}
                      alt={item.product_name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Name and Variant */}
                  <div style={{ flex: 1 }}>
                    <Link href={`/shop/${item.product_slug}`}>
                      <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>{item.product_name}</h3>
                    </Link>
                    <p style={{ fontSize: '13px', color: 'var(--color-indigo-600)' }}>Variant: {item.variant_name}</p>
                    <button 
                      onClick={() => removeFromCart(item.variant_id)}
                      style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--color-indigo-200)',
                    borderRadius: '30px',
                    overflow: 'hidden'
                  }}>
                    <button 
                      onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                      style={{ padding: '6px 12px', fontSize: '14px', color: 'var(--color-indigo-700)', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600', fontSize: '14px', color: 'var(--color-indigo-950)' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      style={{ padding: '6px 12px', fontSize: '14px', color: 'var(--color-indigo-700)', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--color-indigo-950)' }}>
                      ₹{item.total_price}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-indigo-600)' }}>
                      ₹{item.unit_price} each
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ paddingTop: '20px', textAlign: 'left' }}>
                <Link href="/shop" style={{ color: 'var(--color-indigo-900)', fontSize: '14px', fontWeight: '500' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Column 2: Cart Summary */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-indigo-200)',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(27, 35, 64, 0.04)',
              color: 'var(--color-indigo-950)'
            }}>
              <h2 style={{ fontSize: '22px', marginBottom: '24px', borderBottom: '1px solid var(--color-indigo-100)', paddingBottom: '12px', color: 'var(--color-indigo-950)', fontWeight: '600' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                <span style={{ color: 'var(--color-indigo-600)' }}>Subtotal</span>
                <span style={{ fontWeight: '500' }}>₹{subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                <span style={{ color: 'var(--color-indigo-600)' }}>Shipping</span>
                <span style={{ fontWeight: '500' }}>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
              </div>

              {!isShippingFree && (
                <div style={{
                  fontSize: '12px',
                  backgroundColor: 'rgba(73, 92, 135, 0.08)',
                  color: 'var(--color-indigo-800)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  Add ₹{shippingFreeThreshold - subtotal} more for FREE shipping!
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderTop: '1px solid var(--color-indigo-100)', 
                paddingTop: '20px',
                marginBottom: '30px', 
                fontSize: '18px',
                fontWeight: '600' 
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-indigo-950)' }}>₹{total}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-block" style={{ textAlign: 'center', backgroundColor: 'var(--color-indigo-950)', color: '#ffffff' }}>
                Proceed to Checkout
              </Link>
            </div>

          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .cart-item {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px;
          }
          .cart-item > div:last-child {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
