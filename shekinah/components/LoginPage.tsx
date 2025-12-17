
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { LockIcon } from './Icons';

const LoginPage: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
         setError('Credenciales incorrectas.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Cuenta bloqueada temporalmente. Intenta más tarde.');
      } else {
         setError('Error de conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in-scale">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                <LockIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Shekinah <span className="text-blue-500">Admin</span></h2>
            <p className="text-gray-400 text-sm mt-2">Sistema de Gestión Interna</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Usuario / Correo</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-gray-600"
                    placeholder="admin@shekinah.com"
                    required
                />
            </div>
            
            <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Contraseña</label>
                <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-gray-600"
                    placeholder="••••••••"
                    required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-white text-xs uppercase font-bold"
                >
                    {showPassword ? 'Ocultar' : 'Ver'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg">
                    <p className="text-red-400 text-sm text-center font-medium">⚠️ {error}</p>
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
                {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm transition underline">
                ← Volver a la Tienda
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
