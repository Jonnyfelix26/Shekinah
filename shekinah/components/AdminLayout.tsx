
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ShopSection from './ShopSection';
import { ClipboardListIcon, ShoppingBagIcon, XIcon, SettingsIcon } from './Icons';
import PaymentSettingsModal from './PaymentSettingsModal';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 md:h-screen sticky top-0 z-50">
        <div className="p-6 border-b border-gray-800">
           <h1 className="text-2xl font-black italic tracking-tighter">
             Shekinah <span className="text-blue-600">Admin</span>
           </h1>
           <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Sistema de Gestión</p>
        </div>

        <nav className="flex-grow p-4 space-y-2">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
           >
             <ClipboardListIcon className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wide">Pedidos & Reportes</span>
           </button>

           <button 
             onClick={() => setActiveTab('inventory')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
           >
             <ShoppingBagIcon className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wide">Inventario</span>
           </button>

           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
           >
             <SettingsIcon className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wide">Configuración</span>
           </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                AD
              </div>
              <div>
                 <p className="text-sm font-bold text-white">Administrador</p>
                 <p className="text-xs text-green-500 flex items-center gap-1">● En línea</p>
              </div>
           </div>
           <button 
             onClick={logout}
             className="w-full border border-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white text-gray-400 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
           >
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow h-full md:h-screen overflow-y-auto bg-gray-50">
         {activeTab === 'dashboard' ? (
            <AdminDashboard />
         ) : (
            <div className="p-6 md:p-8">
               <div className="mb-6">
                  <h2 className="text-3xl font-black text-gray-900 uppercase italic">Inventario de Productos</h2>
                  <p className="text-gray-500">Gestiona precios, stock y nuevos lanzamientos.</p>
               </div>
               <ShopSection />
            </div>
         )}
      </main>

      <PaymentSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default AdminLayout;
