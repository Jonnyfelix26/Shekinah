
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ShopSection from './components/ShopSection';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';

const AppContent = () => {
  const { auth } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // 1. LOADING STATE
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-bold tracking-widest animate-pulse">CARGANDO SHEKINAH...</p>
         </div>
      </div>
    );
  }

  // 2. ADMIN SYSTEM (Authenticated)
  if (auth.role === 'admin') {
     return <AdminLayout />;
  }

  // 3. ADMIN LOGIN PAGE (Not authenticated but requested)
  if (showLogin) {
     return <LoginPage onCancel={() => setShowLogin(false)} />;
  }

  // 4. CLIENT SYSTEM (Default Storefront)
  return (
    <div className="min-h-full bg-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      <Header />
      <Navigation />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <ShopSection />
        </div>
      </main>
      
      {/* Footer with callback to open Login */}
      <Footer onAdminClick={() => setShowLogin(true)} />
      <Cart />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
