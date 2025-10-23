// =============================================================================
// frontend/src/components/ui/ExtrasModal.tsx - NUEVO ARCHIVO
// =============================================================================

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { type Product } from '@/components/ui/productList';
import { PlusCircle, MinusCircle } from 'lucide-react';

// ===== INTERFACES =====
interface ExtrasModalProps {
  producto: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (producto: Product, extras: Product[]) => void;
  adicionales: Product[];
}

// ===== COMPONENTE MODAL DE EXTRAS =====
export default function ExtrasModal({ producto, isOpen, onClose, onAddToCart, adicionales }: ExtrasModalProps) {
  const [selectedExtras, setSelectedExtras] = useState<Product[]>([]);

  // Limpia los extras seleccionados cada vez que se abre el modal con un nuevo producto
  useEffect(() => {
    if (isOpen) {
      setSelectedExtras([]);
    }
  }, [isOpen]);

  if (!producto) return null;

  // Maneja la selección/deselección de un extra
  const handleExtraClick = (extra: Product) => {
    setSelectedExtras(prev => {
      const isSelected = prev.find(e => e.id === extra.id);
      if (isSelected) {
        return prev.filter(e => e.id !== extra.id); // Quitar extra
      } else {
        return [...prev, extra]; // Agregar extra
      }
    });
  };

  // Confirma y agrega el producto con sus extras al carrito
  const handleConfirmAddToCart = () => {
    onAddToCart(producto, selectedExtras);
    onClose();
  };

  // Calcula el precio total del producto más los extras seleccionados
  const calculateTotalPrice = () => {
    const mainPrice = parseFloat(producto.price.replace('$', ''));
    const extrasPrice = selectedExtras.reduce((total, extra) => {
      return total + parseFloat(extra.price.replace('$', ''));
    }, 0);
    return (mainPrice + extrasPrice).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personaliza tu {producto.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Agrega tus adicionales</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {adicionales.map(extra => {
                const isSelected = selectedExtras.some(e => e.id === extra.id);
                return (
                  <div
                    key={extra.id}
                    className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => handleExtraClick(extra)}
                  >
                    <div>
                      <p className="font-medium">{extra.name}</p>
                      <p className="text-sm text-gray-600">{extra.price}</p>
                    </div>
                    {isSelected ? (
                      <MinusCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <PlusCircle className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between items-center">
          <div className="text-xl font-bold">
            Total: ${calculateTotalPrice()}
          </div>
          <Button onClick={handleConfirmAddToCart} className="bg-emerald-600 hover:bg-emerald-700">
            Agregar al Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}