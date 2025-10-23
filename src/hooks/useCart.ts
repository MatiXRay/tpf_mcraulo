// =============================================================================
// src/hooks/useCart.ts - HOOK PERSONALIZADO PARA EL CARRITO VERSIÓN 2.0
// =============================================================================

import { useState, useCallback, useMemo } from 'react';
import { type Product } from '@/components/ui/productList';

// ===== TIPOS =====
export interface CartItem extends Product {
  cantidad: number;
}

export interface UseCartReturn {
  carritoItems: CartItem[];
  totalCarrito: number;
  cantidadTotal: number;
  showFooter: boolean;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

// ===== HOOK PRINCIPAL =====
export const useCart = (): UseCartReturn => {
  const [carritoItems, setCarritoItems] = useState<CartItem[]>([]);
  const [showFooter, setShowFooter] = useState<boolean>(false);

  // ===== CÁLCULOS MEMOIZADOS =====
  const totalCarrito = useMemo(() => {
    return carritoItems.reduce((total, item) => {
      const precio = parseFloat(item.price.replace('$', ''));
      return total + (precio * item.cantidad);
    }, 0);
  }, [carritoItems]);

  const cantidadTotal = useMemo(() => {
    return carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }, [carritoItems]);

  // ===== FUNCIONES DEL CARRITO =====
  const addToCart = useCallback((product: Product) => {
    setShowFooter(true);
    setCarritoItems(prev => {
      const itemExistente = prev.find(item => item.id === product.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    setCarritoItems(prev => {
      if (newQuantity <= 0) {
        const newItems = prev.filter(item => item.id !== productId);
        if (newItems.length === 0) {
          setShowFooter(false);
        }
        return newItems;
      }
      return prev.map(item =>
        item.id === productId
          ? { ...item, cantidad: newQuantity }
          : item
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCarritoItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      if (newItems.length === 0) {
        setShowFooter(false);
      }
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCarritoItems([]);
    setShowFooter(false);
  }, []);

  const isInCart = useCallback((productId: number) => {
    return carritoItems.some(item => item.id === productId);
  }, [carritoItems]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = carritoItems.find(item => item.id === productId);
    return item ? item.cantidad : 0;
  }, [carritoItems]);

  // ===== EFECTO PARA OCULTAR FOOTER =====
  useMemo(() => {
    if (carritoItems.length === 0) {
      setShowFooter(false);
    }
  }, [carritoItems.length]);

  return {
    carritoItems,
    totalCarrito,
    cantidadTotal,
    showFooter,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
  };
};
