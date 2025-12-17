
import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import { PlusIcon } from './Icons';
import AdminProductModal from './AdminProductModal';
import type { Product } from '../types';

const ShopSection: React.FC = () => {
  const { products, loading } = useProducts();
  const { auth } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Updated categories list strictly as requested
  const categories = [
    'Todos', 
    'Accesorios generales',
    'Accesorios de lujo',
    'Protección personal',
    'Parrillas y sliders',
    'Cascos y fundas',
    'Stickers resinados'
  ];

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Strict category matching
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tienda" className="mb-12 relative min-h-[600px] pt-8">
      {/* Admin Floating Add Button (Bottom Right) */}
      {auth.isAuthenticated && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 border-4 border-white animate-bounce-subtle"
            title="Agregar Producto"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>
      )}

      <AdminProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Controls Header */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           
           {/* Search Bar */}
           <div className="w-full md:w-1/3 relative">
              <input 
                type="text" 
                placeholder="Buscar equipo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-500"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>

           {/* Filter Tabs */}
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === cat 
                    ? 'bg-blue-900 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           // Loading Skeletons
           Array.from({length: 6}).map((_, i) => (
             <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-96 animate-pulse flex flex-col">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 w-full"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-auto"></div>
                <div className="bg-gray-200 h-10 rounded w-full mt-4"></div>
             </div>
           ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4 bg-gray-100 p-6 rounded-full">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No hay resultados para tu búsqueda' : 'El catálogo está vacío'}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {searchTerm ? 'Intenta usar otros términos o cambia de categoría.' : 'Parece que aún no hemos subido nuestros productos a la nube.'}
            </p>
            
            {auth.isAuthenticated && !searchTerm && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Crear Primer Producto
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
