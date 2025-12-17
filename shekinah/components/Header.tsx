
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { auth } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('site_logo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  // Header is now exclusively for the Client View.
  // Admin controls are moved to AdminLayout.
  return (
    <header className="bg-gray-900 text-white py-6 px-6 border-b-4 border-blue-600 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          
          <div className="mb-4 md:mb-0 relative group flex items-center justify-center md:justify-start gap-5">
            {logo && (
              <img 
                src={logo} 
                alt="Shekinah Logo" 
                className="h-16 md:h-24 object-contain rounded-lg bg-white/5 p-1 shadow-lg border border-white/10" 
              />
            )}

            <div className="flex flex-col items-center md:items-start">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter flex flex-col md:block text-center md:text-left leading-none">
                  <span className="text-blue-600">Shekinah</span>
                  <span className="text-white ml-0 md:ml-2">Motor's</span>
                </h1>
            </div>
          </div>

          <div className="text-right flex flex-col items-center md:items-end gap-2 mt-4 md:mt-0">
            <div className="hidden md:block">
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
