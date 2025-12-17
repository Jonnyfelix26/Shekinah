
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { XIcon, PlusIcon, CheckIcon } from './Icons';
import type { Product } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product }) => {
  const { state, dispatch } = useCart();
  const { auth } = useAuth();
  const [wasAdded, setWasAdded] = useState(false);

  if (!isOpen || !product) return null;

  const cartItem = state.items.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const canAddToCart = product.stock > quantityInCart;
  const isAdmin = auth.role === 'admin';

  const handleAddToCart = () => {
    if (!canAddToCart || isAdmin) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
    setWasAdded(true);
    setTimeout(() => setWasAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[80] flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in-scale max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Columna Imagen */}
        <div className={`w-full md:w-1/2 ${product.imageBg || 'bg-gray-100'} p-8 flex items-center justify-center relative`}>
            <div className="absolute top-4 left-4">
                {product.badge && (
                    <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded shadow uppercase">
                        {product.badge}
                    </span>
                )}
            </div>
            {product.image ? (
                <img src={product.image} alt={product.name} className="max-h-[300px] md:max-h-[400px] object-contain drop-shadow-2xl transform hover:scale-105 transition duration-500" />
            ) : (
                <div className="w-full h-64 opacity-50">{product.icon}</div>
            )}
        </div>

        {/* Columna Info */}
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto bg-white">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-1">{product.category}</p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-none">{product.name}</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-black p-2 bg-gray-100 rounded-full transition">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">S/ {product.price.toFixed(2)}</span>
                {product.stock < 5 && product.stock > 0 && (
                    <span className="ml-3 text-sm font-bold text-orange-500 animate-pulse">
                        ¡Solo quedan {product.stock}!
                    </span>
                )}
                {product.stock === 0 && (
                     <span className="ml-3 text-sm font-bold text-red-500 uppercase">
                        Agotado
                    </span>
                )}
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 flex-grow">
                <h4 className="font-bold text-gray-900 uppercase text-sm mb-2">Características:</h4>
                <ul className="space-y-2">
                    {product.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                            <span className="mr-2 text-blue-500">✓</span> {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                    onClick={handleAddToCart}
                    disabled={wasAdded || product.stock === 0 || !canAddToCart || isAdmin}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider ${
                         isAdmin
                         ? 'bg-gray-200 text-gray-500 cursor-default'
                         : product.stock === 0
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         : wasAdded
                         ? 'bg-green-600 text-white'
                         : 'bg-gray-900 text-white hover:bg-blue-600'
                    }`}
                >
                    {isAdmin ? 'Vista Admin' : wasAdded ? (
                        <>
                            <CheckIcon className="w-6 h-6" /> Agregado
                        </>
                    ) : product.stock === 0 ? 'Sin Stock' : (
                        <>
                            <PlusIcon className="w-6 h-6" /> Agregar al Carrito
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
