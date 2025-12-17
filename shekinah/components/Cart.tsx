import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types';
import { XIcon, Trash2Icon, MinusIcon, PlusIcon } from './Icons';
import CheckoutModal from './CheckoutModal';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleUpdateQuantity = (id: string | number, quantity: number, stock: number) => {
    if (quantity > stock) {
        alert(`Solo quedan ${stock} unidades disponibles.`);
        return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string | number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const handleCheckout = () => {
    setCheckoutOpen(true);
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity duration-300 ${
          state.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-900 text-white">
            <h2 className="text-xl font-bold uppercase tracking-wide">Tu Equipo ({itemCount})</h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="text-gray-400 hover:text-white transition"
              aria-label="Close cart"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {state.items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                🏍️
              </div>
              <h3 className="text-xl font-bold text-gray-800">Tu carrito está vacío</h3>
              <p className="text-gray-500 mt-2">Explora nuestro catálogo y equípate para tu próxima aventura.</p>
              <button 
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="mt-6 text-red-600 font-bold hover:text-red-700 uppercase text-sm"
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50">
                {state.items.map(item => (
                  <CartItemComponent key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
                ))}
              </div>
              <div className="p-6 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-gray-600 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-gray-900">S/ {subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded text-lg transition shadow-lg uppercase tracking-wider"
                >
                  Iniciar Compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setCheckoutOpen(false)} total={subtotal} cartItems={state.items} />
    </>
  );
};

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (id: string | number, quantity: number, stock: number) => void;
    onRemove: (id: string | number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className={`w-16 h-16 ${item.imageBg || 'bg-gray-800'} rounded-lg flex items-center justify-center p-1 flex-shrink-0 overflow-hidden`}>
              {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              ) : (
                 <div className="w-full h-full opacity-90 scale-75 text-white">
                   {item.icon}
                 </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 truncate text-sm">{item.name}</h4>
                <p className="text-red-600 font-bold text-sm">S/ {item.price.toFixed(2)}</p>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-300 rounded bg-gray-50">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.stock)} className="p-1 hover:bg-gray-200 text-gray-600"><MinusIcon className="w-3 h-3" /></button>
                        <span className="px-3 font-bold text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.stock)} 
                            className={`p-1 text-gray-600 ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            disabled={item.quantity >= item.stock}
                        >
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition p-1"><Trash2Icon className="w-4 h-4" /></button>
                </div>
                {item.quantity >= item.stock && (
                    <p className="text-[10px] text-orange-500 font-bold mt-1">Máx. disponible</p>
                )}
            </div>
        </div>
    );
};

export default Cart;