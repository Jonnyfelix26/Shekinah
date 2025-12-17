
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

type UserRole = 'admin' | 'client';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  user: User | null;
  loading: boolean; // Nuevo estado de carga
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  auth: { isAuthenticated: false, role: 'client', user: null, loading: true },
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: 'client',
    user: null,
    loading: true // Inicia cargando
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ isAuthenticated: true, role: 'admin', user, loading: false });
      } else {
        setAuthState({ isAuthenticated: false, role: 'client', user: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth: authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
