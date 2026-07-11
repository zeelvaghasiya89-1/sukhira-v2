"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sukhira_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('sukhira_cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product_id === product.id && item.variant_id === variant.id
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [
        ...prevCart,
        {
          product_id: product.id,
          variant_id: variant.id,
          product_name: product.name,
          variant_name: variant.name,
          product_slug: product.slug,
          image_url: product.image_url,
          unit_price: variant.price,
          total_price: variant.price * quantity,
          quantity: quantity,
          stock: variant.stock
        }
      ];
    });
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.variant_id === variantId
          ? { ...item, quantity, total_price: item.unit_price * quantity }
          : item
      )
    );
  };

  const removeFromCart = (variantId) => {
    setCart(prevCart => prevCart.filter(item => item.variant_id !== variantId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
