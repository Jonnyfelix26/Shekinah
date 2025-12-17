
import React, { useState, FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { XIcon } from './Icons';
import type { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cartItems: CartItem[];
}

type FormState = 'idle' | 'submitting';
type PaymentMethod = 'Yape' | 'Plin' | 'Tarjeta' | 'Efectivo';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, cartItems }) => {
  const { dispatch } = useCart();
  const { purchaseItems, addOrder } = useProducts(); 
  const [formState, setFormState] = useState<FormState>('idle');
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Yape');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
        // 0. SANITIZACIÓN DE DATOS (CRÍTICO)
        // Creamos una copia limpia de los items
        const cleanItems = cartItems.map(item => {
            // Crear objeto plano sin referencias a React Components (iconos)
            const cleanItem = {
                id: String(item.id),
                name: item.name || "Sin nombre",
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                category: item.category || "General",
                // Forzamos valores opcionales a tipos primitivos
            };
            return cleanItem;
        });

        // Limpieza profunda final usando JSON parse/stringify
        const sanitizedItems = JSON.parse(JSON.stringify(cleanItems));

        // 1. Guardar Pedido en Base de Datos
        try {
            console.log("Intentando guardar pedido...");
            await addOrder({
                customerName: name,
                customerAddress: address,
                items: sanitizedItems, 
                total: total,
                status: 'pending',
                paymentMethod: paymentMethod
            });
            console.log("Pedido guardado OK.");
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
            // No bloqueamos el flujo de WhatsApp
        }

        // 2. Generar Mensaje de WhatsApp
        const phoneNumber = "51946138476"; 
        
        // FORMATO ACTUALIZADO SEGÚN REQUERIMIENTO
        let message = `🏍️ *HOLA SHEKINAH MOTOR'S, QUIERO REALIZAR UN PEDIDO:*\n\n`;
        
        // Listado de productos
        cartItems.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (S/ ${item.price.toFixed(2)})\n`;
        });
        
        // Total
        message += `\n💰 *TOTAL: S/ ${total.toFixed(2)}*\n\n`;

        // Datos del Cliente
        message += `👤 *DATOS DEL CLIENTE:*\n`;
        message += `Nombre: ${name}\n`;
        message += `Dirección/Ciudad: ${address}\n`;
        message += `Método de Pago: ${paymentMethod}\n\n`;
        
        // Despedida
        message += `Espero su confirmación para realizar el pago. ¡Gracias!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // 3. Descontar Stock
        try {
            await purchaseItems(cartItems);
        } catch (stockError) {
            console.warn("No se pudo descontar stock automático:", stockError);
        }

        // 4. Redirigir a WhatsApp y Limpiar
        window.open(whatsappUrl, '_blank');
        dispatch({ type: 'CLEAR_CART' });
        onClose();

    } catch (error) {
        console.error("Error fatal en checkout:", error);
        alert("Ocurrió un error inesperado. Revisa tu conexión.");
    } finally {
        setFormState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fade-in-scale">
        <div className="p-0 relative">
          {/* Header */}
          <div className="bg-green-600 p-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
             <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                PEDIR POR WHATSAPP
             </h2>
             <button onClick={onClose} className="text-white/80 hover:text-white">
               <XIcon className="w-6 h-6" />
             </button>
          </div>
          
          <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-sm text-green-800">
                 Al confirmar, se abrirá WhatsApp con el detalle de tu pedido para coordinar el pago y el envío directamente con nosotros.
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECCIÓN 1: DATOS */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">TUS DATOS</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nombre Completo</label>
                      <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-gray-900" placeholder="Juan Pérez" />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-xs font-bold text-gray-700 mb-1 uppercase">Dirección / Ciudad</label>
                      <input type="text" id="address" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-gray-900" placeholder="Av. Principal 123, Lima" />
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: MÉTODO DE PAGO */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">PAGO</h3>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Método de Pago Preferido</label>
                  <select 
                     value={paymentMethod} 
                     onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                     className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:border-green-500 outline-none text-gray-900"
                  >
                     <option value="Yape">Yape / Plin</option>
                     <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                     <option value="Efectivo">Efectivo (Contraentrega)</option>
                  </select>
                </div>
                
                <div className="bg-gray-900 rounded p-4 flex justify-between items-center text-white shadow-lg">
                    <span className="font-medium text-gray-300">Total a Pagar</span>
                    <span className="text-2xl font-black">S/ {total.toFixed(2)}</span>
                </div>
                
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-4 rounded transition-all duration-300 disabled:opacity-50 flex items-center justify-center uppercase tracking-widest shadow-xl hover:shadow-green-500/30"
                >
                  {formState === 'submitting' ? (
                    <span>PROCESANDO...</span>
                  ) : (
                      <span className="flex items-center gap-2">
                          ENVIAR PEDIDO AL WHATSAPP
                      </span>
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
