
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBagIcon } from './Icons';

const Navigation: React.FC = () => {
  const { state, dispatch } = useCart();
  const { auth } = useAuth();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    "Accesorios generales",
    "Accesorios de lujo",
    "Protección personal",
    "Parrillas y sliders",
    "Cascos y fundas",
    "Stickers resinados"
  ];

  return (
    <nav className="bg-black sticky top-0 z-50 border-b border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto mr-4">
          {navItems.map((item) => (
            <a 
              key={item} 
              href="#tienda" 
              className="text-gray-300 font-bold hover:text-red-500 transition uppercase text-xs md:text-sm tracking-wide whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>
        
        {/* Cart Button - Hidden for Admins */}
        <div className="relative flex-shrink-0 ml-auto md:ml-4">
          {auth.role !== 'admin' ? (
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="text-white hover:text-red-500 transition focus:outline-none flex items-center gap-2"
              aria-label="Open shopping cart"
            >
              <span className="hidden sm:inline text-sm font-bold">CARRITO</span>
              <div className="relative">
                <ShoppingBagIcon className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </button>
          ) : (
            <div className="text-gray-500 text-xs font-bold border border-gray-700 px-2 py-1 rounded uppercase cursor-default select-none">
              Vista Admin
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
