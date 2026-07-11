"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const pathname = usePathname();
  const { cart, updateQuantity, removeFromCart, getSubtotal } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCartOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // Dynamic color configuration based on scroll position and active page
  const isHomePage = pathname === '/';
  const isHeaderDark = scrolled || isHomePage;
  const textColor = isHeaderDark ? '#ffffff' : 'var(--color-indigo-950)';
  const secondaryTextColor = isHeaderDark ? 'rgba(245, 247, 252, 0.75)' : 'rgba(27, 35, 64, 0.7)';

  return (
    <>
      <header className="header-wrapper" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        {/* Desktop Split Capsules */}
        <div className="container desktop-header-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          width: '100%',
          maxWidth: '100%',
          paddingLeft: '32px',
          paddingRight: '32px'
        }}>
          {/* Left Capsule: Logo + Main Links */}
          <div className={`floating-capsule ${scrolled ? 'scrolled' : ''}`} style={{
            gap: '24px',
            height: scrolled ? '54px' : '64px',
            padding: scrolled ? '0 20px' : '0 28px',
            // If scrolled is false, override theme style to be transparent
            backgroundColor: scrolled ? 'rgba(27, 35, 64, 0.5)' : 'transparent',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            boxShadow: scrolled ? '0 12px 40px rgba(0, 0, 0, 0.25)' : 'none',
            backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none'
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: '600',
                letterSpacing: '-0.5px',
                color: textColor,
                transition: 'color 0.3s ease'
              }}>
                Sukhira
              </span>
            </Link>

            <span style={{ 
              width: '1px', 
              height: '20px', 
              backgroundColor: isHeaderDark ? 'rgba(255,255,255,0.15)' : 'rgba(27,35,64,0.15)',
              transition: 'background-color 0.3s ease'
            }} />

            {/* Navigation links */}
            <nav style={{ display: 'flex', gap: '8px' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    href={link.path}
                    className={`capsule-link ${isActive ? 'active' : ''}`}
                    style={{
                      color: isActive ? textColor : secondaryTextColor,
                      // Override capsule hover background fill colors for light mode
                      backgroundColor: isHeaderDark 
                        ? (isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent') 
                        : (isActive ? 'rgba(27, 35, 64, 0.08)' : 'transparent'),
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Capsule: Account + Cart */}
          <div className={`floating-capsule ${scrolled ? 'scrolled' : ''}`} style={{
            gap: '8px',
            height: scrolled ? '54px' : '64px',
            padding: scrolled ? '0 16px' : '0 20px',
            backgroundColor: scrolled ? 'rgba(27, 35, 64, 0.5)' : 'transparent',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            boxShadow: scrolled ? '0 12px 40px rgba(0, 0, 0, 0.25)' : 'none',
            backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none'
          }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: secondaryTextColor, padding: '0 8px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Hi, {user.displayName || user.email.split('@')[0]}
                </span>
                <button 
                  onClick={logout} 
                  className="capsule-link" 
                  style={{ 
                    fontSize: '13px',
                    color: 'rgba(255, 107, 107, 0.9)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    fontFamily: 'inherit'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="capsule-link" 
                style={{ 
                  fontSize: '13px',
                  color: secondaryTextColor
                }}
              >
                Sign In
              </Link>
            )}

            <span style={{ 
              width: '1px', 
              height: '16px', 
              backgroundColor: isHeaderDark ? 'rgba(255,255,255,0.15)' : 'rgba(27,35,64,0.15)',
              margin: '0 4px',
              transition: 'background-color 0.3s ease'
            }} />

            {/* Cart Trigger Button */}
            <button 
              suppressHydrationWarning={true}
              onClick={() => setCartOpen(true)} 
              className="capsule-link"
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: textColor,
                background: 'none',
                border: 'none',
                padding: '8px 12px'
              }}
              aria-label="Open cart"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Cart</span>
              <span style={{
                backgroundColor: 'var(--color-accent-pea)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Header: Unified Capsule Floating at the Top */}
        <div className="mobile-header-container" style={{
          display: 'none',
          padding: '16px',
          width: '100%'
        }}>
          <div className={`floating-capsule ${scrolled ? 'scrolled' : ''}`} style={{
            width: '100%',
            justifyContent: 'space-between',
            height: '56px',
            padding: '0 20px',
            position: 'relative',
            backgroundColor: scrolled ? 'rgba(27, 35, 64, 0.6)' : 'rgba(27, 35, 64, 0.85)', // Keep mobile capsule semi-solid for readability
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'var(--shadow-small)'
          }}>
            {/* Logo */}
            <Link href="/">
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Sukhira
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Cart Trigger */}
              <button 
                onClick={() => setCartOpen(true)}
                style={{ 
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                </svg>
                <span style={{
                  backgroundColor: 'var(--color-accent-pea)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: '9999px'
                }}>{cartCount}</span>
              </button>

              {/* Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: '#ffffff', display: 'flex', padding: '4px' }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu Panel dropdown inside capsule */}
            {mobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '68px',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(27, 35, 64, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-large)'
              }}>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.path}
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: pathname === link.path ? '#ffffff' : 'rgba(245,247,252,0.75)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: pathname === link.path ? 'rgba(255,255,255,0.08)' : 'transparent'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                <span style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 12px' }}>
                    <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
                      Logged in as: {user.displayName || user.email}
                    </span>
                    <button 
                      onClick={logout} 
                      style={{ 
                        fontSize: '16px',
                        color: 'rgba(255, 107, 107, 0.9)',
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '10px',
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontFamily: 'inherit'
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    style={{
                      fontSize: '16px',
                      color: 'rgba(245,247,252,0.75)',
                      padding: '8px 12px'
                    }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer Backdrop */}
      <div 
        className={`cart-drawer-backdrop ${cartOpen ? 'open' : ''}`} 
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer Panel */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--color-indigo-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-indigo-900)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Your Ritual Cart</h2>
          <button 
            onClick={() => setCartOpen(false)}
            style={{ 
              padding: '6px', 
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--color-indigo-300)'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14.5c.9 1 2.2 1.5 4 1.5s3.1-.5 4-1.5"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <p style={{ fontSize: '16px', marginBottom: '24px' }}>Your cart is empty.</p>
              <Link href="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary" style={{ backgroundColor: 'var(--color-indigo-100)', color: 'var(--color-indigo-950)' }}>
                Browse Teas
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div key={item.variant_id} style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--color-indigo-800)'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-indigo-900)',
                    flexShrink: 0
                  }}>
                    <Image 
                      src={item.image_url || '/images/hero_product.png'} 
                      alt={item.product_name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {item.product_name}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--color-indigo-300)' }}>
                        {item.variant_name}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      {/* Quantity Selector */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        border: '1px solid var(--color-indigo-700)',
                        borderRadius: '20px',
                        padding: '2px 8px',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          style={{ padding: '4px', fontSize: '14px', color: 'var(--color-indigo-200)' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '16px', textAlign: 'center', color: '#ffffff' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          style={{ padding: '4px', fontSize: '14px', color: 'var(--color-indigo-200)' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.variant_id)}
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-error)',
                          fontWeight: '500'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', color: '#ffffff', fontSize: '15px' }}>
                    ₹{item.total_price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--color-indigo-800)',
            backgroundColor: 'var(--color-indigo-900)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '15px', color: 'var(--color-indigo-200)' }}>Subtotal</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                ₹{getSubtotal()}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-indigo-300)', marginBottom: '20px' }}>
              Shipping and taxes calculated at checkout.
            </p>
            <Link 
              href="/checkout" 
              onClick={() => setCartOpen(false)}
              className="btn btn-primary btn-block"
              style={{
                backgroundColor: 'var(--color-indigo-100)',
                color: 'var(--color-indigo-950)',
                textAlign: 'center',
                justifyContent: 'center'
              }}
            >
              Secure Checkout
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 992px) {
          .desktop-header-container {
            display: none !important;
          }
          .mobile-header-container {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
