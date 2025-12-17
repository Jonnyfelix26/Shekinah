
import React from 'react';
import { PRODUCTS } from '../constants';
import type { Product } from '../types';
import ProductCard from './ProductCard';

const CategoryHeader: React.FC<{ title: string, subtitle: string, gradient: string }> = ({ title, subtitle, gradient }) => (
  <div className={`${gradient} rounded-2xl p-8 mb-6`}>
    <h3 className="text-4xl font-bold text-white mb-2 text-center">{title}</h3>
    <p className="text-white text-center text-lg">{subtitle}</p>
  </div>
);

const MandalasSection: React.FC = () => {
  // Cast category to string to resolve type mismatch errors, as 'Animales' and 'Objetos' are not currently in the Product type
  const animalProducts = PRODUCTS.filter(p => (p.category as string) === 'Animales');
  const objectProducts = PRODUCTS.filter(p => (p.category as string) === 'Objetos');

  return (
    <section id="mandalas" className="mb-12">
      <h2 className="text-4xl font-bold text-teal-700 mb-6">📚 Libros de Mandalas para Colorear - Antiestrés</h2>
      <div className="bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 rounded-2xl p-8 mb-8 shadow-xl">
        <p className="text-xl text-gray-800 mb-4 font-semibold">Los mandalas son herramientas poderosas para reducir el estrés y la ansiedad. Colorear mandalas te ayuda a:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-800 text-lg font-medium">
          <li>✨ Mejorar la concentración y el enfoque</li>
          <li>🧘‍♀️ Reducir los niveles de ansiedad</li>
          <li>💆‍♀️ Promover la relajación mental</li>
          <li>🎨 Estimular la creatividad</li>
        </ul>
      </div>

      <CategoryHeader title="🐾 Categoría: Animales" subtitle="Conecta con la naturaleza a través del arte" gradient="bg-gradient-to-r from-cyan-500 to-blue-500" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {animalProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <CategoryHeader title="✨ Categoría: Objetos" subtitle="Explora formas, símbolos y belleza natural" gradient="bg-gradient-to-r from-pink-500 to-yellow-500" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {objectProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MandalasSection;