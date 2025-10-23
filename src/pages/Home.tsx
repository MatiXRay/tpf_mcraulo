// =============================================================================
// src/pages/Home.tsx - VERSIÓN 2.0 OPTIMIZADA
// =============================================================================

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import SideBar from "@/components/ui/sidebar"
import ProductList, { type Product } from "@/components/ui/productList"
import Checkout from "./Checkout"
import CashPayment from "./CashPayment"
import CardPayment from "./CardPayment"
import { useCart } from "@/hooks/useCart";




// ===== TIPOS E INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

type CheckoutStep = 'products' | 'checkout' | 'cash' | 'card';

// ===== COMPONENTE PRINCIPAL =====
export default function Home() {
  // ===== ESTADOS =====
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('products');

  // Reemplazar todo el manejo del carrito con el hook
  const {
    carritoItems,
    totalCarrito,
    showFooter,
    addToCart,
    updateQuantity: handleUpdateCantidad,
    removeFromCart: handleRemoveItem
  } = useCart();

  const handleProductClick = useCallback((producto: Product) => {
    try {
      console.log('🛒 handleProductClick ejecutado:', producto.name);
      addToCart(producto);
    } catch (error) {
      console.error('Error en handleProductClick:', error);
    }
    return false; // Agregar esto para prevenir propagación
  }, [addToCart]);

  // ===== COMPONENTES INTERNOS =====
  const CartFooter = () => {
    console.log('🦶 CartFooter renderizado con:', { carritoItems: carritoItems.length, totalCarrito });

    if (carritoItems.length === 0) {
      console.log('❌ CartFooter no debería renderizarse - carrito vacío');
      return null;
    }

    return (
      <footer className="fixed bottom-0 left-64 right-0 bg-white border-t-4 border-yellow-400 shadow-2xl p-4 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto pr-4">
            {carritoItems.map(item => (
              <div key={item.id} className="flex-shrink-0 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <img
                  src={item.imageSrc || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => handleUpdateCantidad(item.id, item.cantidad - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => handleUpdateCantidad(item.id, item.cantidad + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 ml-6">
            <div className="text-right">
              <p className="text-gray-600 font-medium">Total del Pedido</p>
              <p className="font-extrabold text-3xl text-gray-800">${totalCarrito.toFixed(2)}</p>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white h-16 px-8 rounded-lg text-lg font-bold"
              onClick={() => setCheckoutStep('checkout')}
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Pagar Ahora
            </Button>
          </div>
        </div>
      </footer>
    );
  };

  const MainContent = () => {
    switch (checkoutStep) {
      case 'checkout':
        return (
          <Checkout
            carritoItems={carritoItems}
            totalCarrito={totalCarrito}
            onBack={() => setCheckoutStep('products')}
            onUpdateCantidad={handleUpdateCantidad}
            onRemoveItem={handleRemoveItem}
            onSelectPaymentMethod={(method) => setCheckoutStep(method)}
          />
        );
      case 'cash':
        return (
          <CashPayment
            carritoItems={carritoItems}
            totalCarrito={totalCarrito}
            onBack={() => setCheckoutStep('checkout')}
          />
        );
      case 'card':
        return (
          <CardPayment
            onBack={() => setCheckoutStep('checkout')}
          />
        );
      case 'products':
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
              <div className="px-6 py-6">
                <h1 className="text-4xl font-bold text-gray-800 text-center">
                  {selectedCategory === "todas" ? "🍔 Elige tu pedido" :
                    `🍔 ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                </h1>
              </div>
            </header>
            <main className={`flex-1 overflow-y-auto p-6 ${carritoItems.length > 0 ? 'mb-32' : ''}`}>

              <ProductList
                onProductClick={handleProductClick}
                categoria={selectedCategory === "todas" ? undefined : selectedCategory}
                incluirIngredientes={false}
              />
            </main>
          </div>
        );
    }
  };

  // ===== DEBUG =====
  console.log('🔍 Debug Footer:', {
    checkoutStep,
    showFooter,
    carritoLength: carritoItems.length,
    shouldShowFooter: checkoutStep === 'products' && showFooter && carritoItems.length > 0
  });

  // ===== RENDER PRINCIPAL =====
  const shouldShowFooter = checkoutStep === 'products' && showFooter && carritoItems.length > 0;

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar onCategorySelect={setSelectedCategory} />
      <MainContent />
      {shouldShowFooter && <CartFooter />}
    </div>
  );
}