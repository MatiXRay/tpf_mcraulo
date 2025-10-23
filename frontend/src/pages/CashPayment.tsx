// =============================================================================
// src/pages/CashPayment.tsx - VERSIÓN 2.0 OPTIMIZADA
// =============================================================================

import { ArrowLeft, ArrowDown, Ticket, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Product } from "@/components/ui/productList"

// ===== TIPOS E INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

interface CashPaymentProps {
  carritoItems: CartItem[]
  totalCarrito: number
  onBack: () => void
}

// ===== COMPONENTES INTERNOS =====
const TicketItem = ({ item }: { item: CartItem }) => (
  <div className="flex justify-between text-sm">
    <span className="flex-1">{item.cantidad}x {item.name}</span>
    <span className="font-semibold">
      ${(parseFloat(item.price.replace('$', '')) * item.cantidad).toFixed(2)}
    </span>
  </div>
);

const TicketComponent = ({ carritoItems, totalCarrito }: { carritoItems: CartItem[]; totalCarrito: number }) => (
  <div className="border-dashed border-2 border-gray-300 p-6 mb-6 bg-white/50 backdrop-blur-sm">
    <div className="text-center mb-4">
      <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-2" />
      <h2 className="text-xl font-bold text-gray-800">McRaulo's</h2>
      <p className="text-sm text-gray-500">Ticket de Pedido</p>
    </div>

    <div className="space-y-2 text-left mb-4">
      {carritoItems.map((item) => (
        <TicketItem key={item.id} item={item} />
      ))}
    </div>

    <div className="border-t border-gray-300 pt-4 mt-4">
      <div className="flex justify-between font-bold text-lg text-red-600">
        <span>TOTAL:</span>
        <span>${totalCarrito.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

// ===== COMPONENTE PRINCIPAL =====
export default function CashPayment({ carritoItems, totalCarrito, onBack }: CashPaymentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                ¡Gracias por tu pedido!
              </h1>
              <p className="text-sm text-gray-500">Tu ticket se está imprimiendo...</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-200 text-center">
          <TicketComponent carritoItems={carritoItems} totalCarrito={totalCarrito} />

          {/* Instrucción animada */}
          <div className="animate-bounce">
            <ArrowDown className="mx-auto h-10 w-10 text-emerald-600" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-2">
            Retirar ticket y presentar en caja
          </p>

          <div className="mt-6 p-4 bg-emerald-100 rounded-lg">
            <p className="text-sm text-emerald-700">
              💡 Presenta este ticket en la caja para completar tu pago
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}