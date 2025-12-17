
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative h-[600px] w-full bg-gray-900 overflow-hidden mb-12 border-b-8 border-red-600 shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-1 w-12 bg-red-600"></div>
             <span className="text-red-500 font-bold tracking-[0.3em] text-sm md:text-base uppercase">
               Shekinah Motor's
             </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none italic tracking-tighter">
            TU PASIÓN, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              TU ESTILO
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl leading-relaxed">
            Encuentra los mejores <span className="text-white font-bold">cascos, accesorios y protección</span> para rodar con seguridad y marcar la diferencia en cada ruta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#tienda" 
              className="bg-red-600 text-white font-bold py-4 px-10 rounded transition-all transform hover:translate-y-[-2px] hover:shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] text-center uppercase tracking-wider flex items-center justify-center gap-2 group"
            >
              Ver Tienda
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
            <a 
              href="https://www.facebook.com/ShekinaMotors" 
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 hover:border-white text-white font-bold py-4 px-10 rounded transition-all hover:bg-white hover:text-black text-center uppercase tracking-wider backdrop-blur-sm"
            >
              Comunidad
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
