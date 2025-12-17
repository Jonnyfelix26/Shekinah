
import React from 'react';
import { FacebookIcon, LockIcon, MapPinIcon } from './Icons';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const whatsappUrl = "https://wa.me/51946138476?text=Hola,%20quiero%20hacer%20seguimiento%20de%20mi%20pedido";
  const mapUrl = "https://maps.google.com/?q=C.+Rosario+880,+11701";

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {/* Columna 1: Marca */}
        <div>
           <h2 className="text-2xl font-black text-white italic mb-4">
             <span className="text-white">Shekinah</span><span className="text-red-600 ml-2">Motor's</span>
           </h2>
           <p className="mb-4 text-sm">Equipamiento profesional para motociclistas. Tu seguridad y estilo son nuestra prioridad.</p>
           <p className="text-xs">©️ 2025 Shekinah Motor's.</p>
           
           {/* Redes Sociales */}
           <div className="mt-6">
              <a 
                href="https://www.facebook.com/ShekinaMotors" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition"
              >
                <FacebookIcon className="w-5 h-5" />
                <span className="font-bold text-sm">Facebook</span>
              </a>
           </div>
        </div>

        {/* Columna 2: Categorías */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Categorías</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#tienda" className="hover:text-red-500 transition">Cascos</a></li>
            <li><a href="#tienda" className="hover:text-red-500 transition">Indumentaria</a></li>
            <li><a href="#tienda" className="hover:text-red-500 transition">Accesorios</a></li>
            <li><a href="#tienda" className="hover:text-red-500 transition">Protección</a></li>
          </ul>
        </div>

        {/* Columna 3: Soporte */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Soporte</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition flex items-center gap-1">
                <span className="text-green-500">●</span> Rastrea tu pedido
              </a>
            </li>
            <li><a href="#" className="hover:text-red-500 transition">Política de Devolución</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Guía de Tallas</a></li>
            <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 4: Ubicación (NUEVA) */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Ubícanos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPinIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                C. Rosario 880, 11701<br/>
                Chincha Alta, Perú
              </span>
            </li>
            <li>
              <a 
                href={mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 font-bold hover:underline flex items-center gap-1"
              >
                Ver en Google Maps &rarr;
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Admin Access Link */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
         {onAdminClick && (
           <button 
             onClick={onAdminClick} 
             className="text-gray-700 hover:text-gray-500 text-xs flex items-center gap-1 mx-auto transition"
           >
             <LockIcon className="w-3 h-3" /> Acceso Administrativo
           </button>
         )}
      </div>
    </footer>
  );
};

export default Footer;
