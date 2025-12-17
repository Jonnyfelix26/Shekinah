
import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CheckIcon, PlusIcon, EditIcon, Trash2Icon, EyeIcon } from './Icons'; // Importar EyeIcon
import AdminProductModal from './AdminProductModal';
import ProductDetailModal from './ProductDetailModal'; // Importar detalle

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useCart();
  const { auth } = useAuth();
  const { deleteProduct } = useProducts();
  
  const [wasAdded, setWasAdded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Estado para detalle

  const { name, price, description, imageBg, badge, icon, image, stock } = product;
  
  // Check if product is in cart and how many
  const cartItem = state.items.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;
  const canAddToCart = stock > quantityInCart;
  
  // Admins cannot buy
  const isAdmin = auth.role === 'admin';

  const handleAddToCart = () => {
    if (!canAddToCart || isAdmin) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
    setWasAdded(true);
    setTimeout(() => setWasAdded(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`¿ELIMINAR PRODUCTO?\n\nEstás a punto de borrar permanentemente:\n"${name}"\n\nEsta acción no se puede deshacer.`)) {
      deleteProduct(product.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className={`group bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 flex flex-col h-full relative ${isOutOfStock ? 'border-gray-200 opacity-75 grayscale-[0.5]' : 'border-gray-200 hover:shadow-2xl hover:border-blue-500'}`}>
        
        {/* CONTROLES DE ADMINISTRADOR */}
        {isAdmin && (
          <>
            <div className="absolute top-3 left-3 z-50 flex gap-2">
                <button 
                  onClick={handleEditClick}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition transform hover:scale-110 flex items-center justify-center border-2 border-white"
                  title="Editar Producto"
                  type="button"
                >
                  <EditIcon className="w-5 h-5 pointer-events-none" />
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-10 h-10 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-110 flex items-center justify-center border-2 border-white"
                  title="Eliminar Producto"
                  type="button"
                >
                  <Trash2Icon className="w-5 h-5 pointer-events-none" />
                </button>
            </div>
            <div className="absolute top-12 left-3 z-40">
               <span className="bg-gray-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow border border-gray-700 opacity-90">
                 ID: {product.id}
               </span>
            </div>
          </>
        )}

        {/* Stock Badges */}
        <div className="absolute top-3 right-3 z-40 flex flex-col gap-1 items-end pointer-events-none">
            {badge && (
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase">
                {badge}
                </span>
            )}
            {isOutOfStock ? (
                 <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase">
                    Agotado
                 </span>
            ) : isLowStock ? (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase animate-pulse">
                    ¡Últimas {stock}!
                </span>
            ) : null}
        </div>

        {/* Image Area - Clickable para detalle */}
        <div 
          className={`${image ? 'bg-white' : imageBg} p-4 md:p-8 relative overflow-hidden h-64 flex items-center justify-center cursor-pointer`}
          onClick={() => setIsDetailModalOpen(true)}
        >
          <div className="transform transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl w-full h-full flex items-center justify-center">
            {image ? (
              <img src={image} alt={name} className="max-h-full max-w-full object-contain" />
            ) : (
              icon || (
                <svg viewBox="0 0 200 200" className="w-full h-40 opacity-50">
                   <rect x="50" y="50" width="100" height="100" fill="#cbd5e1" rx="10" />
                   <path d="M80,80 L120,120 M120,80 L80,120" stroke="#94a3b8" strokeWidth="10" />
                </svg>
              )
            )}
          </div>
          
          {/* Botón Ver Detalle superpuesto al hacer hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
             <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                <EyeIcon className="w-4 h-4" /> Ver Detalle
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow relative z-0">
          <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => setIsDetailModalOpen(true)}>
             <h4 className="text-xl font-black text-gray-900 uppercase leading-tight hover:text-blue-600 transition">{name}</h4>
             {isAdmin && (
                 <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded border">Stock: {stock}</span>
             )}
          </div>
          
          <ul className="text-sm text-gray-500 mb-6 space-y-1 flex-grow cursor-pointer" onClick={() => setIsDetailModalOpen(true)}>
            {description && description.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-blue-500 font-bold">›</span> {item}
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Precio</p>
              <p className="text-2xl font-bold text-gray-900">S/ {price.toFixed(2)}</p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={wasAdded || isOutOfStock || !canAddToCart || isAdmin}
              className={`h-12 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center uppercase text-sm tracking-wide shadow-lg ${
                isAdmin
                  ? 'bg-gray-200 text-gray-500 cursor-default shadow-none' 
                  : isOutOfStock 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : wasAdded 
                      ? 'bg-green-600 text-white cursor-default' 
                      : !canAddToCart 
                          ? 'bg-orange-300 text-white cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-blue-500/50'
              }`}
            >
              {isAdmin ? (
                'VISTA ADMIN'
              ) : isOutOfStock ? (
                  'Agotado'
              ) : wasAdded ? (
                <CheckIcon className="w-5 h-5" />
              ) : !canAddToCart ? (
                  'Max Stock'
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" /> AGREGAR
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AdminProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        productToEdit={product}
      />
      
      <ProductDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
