
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { XIcon, LockIcon } from './Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      console.error("Firebase Login Error:", err.code, err.message);
      
      // Manejo detallado de errores
      if (err.code === 'auth/invalid-api-key') {
         setError('❌ ERROR DE CONFIGURACIÓN: No has pegado tus API KEYS en el archivo lib/firebase.ts');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Correo o contraseña incorrectos. Verifica en tu consola de Firebase.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Demasiados intentos fallidos. Espera unos minutos.');
      } else if (err.code === 'auth/network-request-failed') {
         setError('Error de conexión. Verifica tu internet.');
      } else {
         setError(`Error: ${err.code || 'Intenta nuevamente'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-scale">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold uppercase tracking-wider">Admin Panel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <LockIcon className="w-8 h-8 text-gray-900" />
            </div>
            <p className="text-sm text-gray-500">Acceso seguro vía Firebase</p>
          </div>

          <div>
             <input
              type="email"
              placeholder="admin@shekinah.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mb-3 text-gray-900"
            />
            <input
              type="password"
              placeholder="Contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-red-600 text-xs font-bold text-center leading-tight">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition uppercase text-sm tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
