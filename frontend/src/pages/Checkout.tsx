// =============================================================================
// src/pages/Checkout.tsx - VERSIÓN 2.0 OPTIMIZADA
// =============================================================================

import { ShoppingCart, CreditCard, DollarSign, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Product } from "@/components/ui/productList"

// ===== TIPOS E INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

interface CheckoutProps {
  carritoItems: CartItem[]
  totalCarrito: number
  onBack: () => void
  onUpdateCantidad: (productoId: number, nuevaCantidad: number) => void
  onRemoveItem: (productoId: number) => void
  onSelectPaymentMethod: (method: 'cash' | 'card') => void;
}

// ===== COMPONENTES INTERNOS =====
const CartItemCard = ({
  item,
  onUpdateCantidad,
  onRemoveItem
}: {
  item: CartItem;
  onUpdateCantidad: (id: number, cantidad: number) => void;
  onRemoveItem: (id: number) => void;
}) => (
  <div className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0">
    <div className="flex-1 pr-4">
      <p className="font-bold text-lg text-gray-800">{item.name}</p>
      <p className="text-gray-500 font-medium">{item.price} c/u</p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-red-50 hover:border-red-300"
        onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="font-bold text-lg text-center w-8">{item.cantidad}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-green-50 hover:border-green-300"
        onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onRemoveItem(item.id)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

const PaymentMethodCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "default"
}: {
  icon: any;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "secondary";
}) => (
  <Button
    variant="outline"
    className={`w-full justify-start items-center text-left h-24 p-6 border-2 transition-all duration-200 hover:shadow-lg ${variant === "secondary"
        ? "hover:border-yellow-500 hover:bg-yellow-50"
        : "hover:border-red-500 hover:bg-red-50"
      }`}
    onClick={onClick}
  >
    <Icon className={`h-10 w-10 mr-6 ${variant === "secondary" ? "text-yellow-600" : "text-gray-700"}`} />
    <div>
      <span className="text-xl font-bold text-gray-800 block">{title}</span>
      {description && (
        <span className="text-sm text-gray-500 block">{description}</span>
      )}
    </div>
  </Button>
);

// ===== COMPONENTE PRINCIPAL =====
export default function Checkout({
  carritoItems,
  totalCarrito,
  onBack,
  onUpdateCantidad,
  onRemoveItem,
  onSelectPaymentMethod
}: CheckoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="text-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Resumen del Pedido */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="h-7 w-7 mr-3 text-red-600" />
              Tu Pedido
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3 scrollbar-hide">
              {carritoItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateCantidad={onUpdateCantidad}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6">
              <div className="flex justify-between items-center font-extrabold text-2xl text-gray-800">
                <span>Total:</span>
                <span className="text-red-600">${totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
              ¿Cómo quieres pagar?
            </h2>
            <div className="space-y-6">
              <PaymentMethodCard
                icon={CreditCard}
                title="Tarjeta de Crédito / Débito"
                description="Pago seguro con tarjeta"
                onClick={() => onSelectPaymentMethod('card')}
              />
              <PaymentMethodCard
                icon={DollarSign}
                title="Pagar en Caja"
                description="Pago en efectivo"
                onClick={() => onSelectPaymentMethod('cash')}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}