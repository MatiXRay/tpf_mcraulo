// =============================================================================
// src/pages/CardPayment.tsx - VERSIÓN 2.0 OPTIMIZADA
// =============================================================================

import { ArrowLeft, ArrowDown, CreditCard, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// ===== TIPOS E INTERFACES =====
interface CardPaymentProps {
  onBack: () => void
}

// ===== COMPONENTES INTERNOS =====
const CardReader = () => (
  <div className="mt-4 p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl w-3/4 mx-auto shadow-lg">
    <div className="h-3 bg-gray-900 rounded w-full mb-2"></div>
    <div className="h-1 bg-gray-600 rounded w-2/3 mx-auto"></div>
    <p className="text-xs text-gray-400 mt-2 text-center">Lector de tarjetas</p>
  </div>
);

const SecurityBadge = () => (
  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
    <Shield className="h-4 w-4 text-green-600" />
    <span>Pago seguro y encriptado</span>
  </div>
);

// ===== COMPONENTE PRINCIPAL =====
export default function CardPayment({ onBack }: CardPaymentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                Pago con Tarjeta
              </h1>
              <p className="text-sm text-gray-500">Sigue las instrucciones en el lector de tarjetas</p>
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
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-200 text-center">
          {/* Icono principal */}
          <div className="mb-6">
            <CreditCard className="mx-auto h-16 w-16 text-blue-500" />
          </div>

          {/* Título principal */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Por favor, inserte o deslice su tarjeta
          </h2>

          {/* Animación de flecha */}
          <div className="animate-bounce mb-6">
            <ArrowDown className="mx-auto h-12 w-12 text-blue-600" />
          </div>

          {/* Lector de tarjetas */}
          <CardReader />

          {/* Badge de seguridad */}
          <SecurityBadge />

          {/* Instrucciones adicionales */}
          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span>Transacción segura y encriptada</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}