import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReviews from './pages/AdminReviews';
import AIAssistant from './components/AIAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { Product, CartItem } from './types';

// Context Definitions
interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  language: 'en' | 'cn';
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  toggleLanguage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [language, setLanguage] = useState<'en' | 'cn'>('en');

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const clearCart = () => setCart([]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'cn' : 'en');
  };

  return (
    <AdminAuthProvider>
      <AuthProvider>
        <AppContext.Provider value={{ cart, wishlist, language, addToCart, removeFromCart, updateCartQuantity, toggleWishlist, clearCart, toggleLanguage }}>
          <HashRouter>
            <ScrollToTop />
            <Routes>
              {/* Main Store Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                {/* Deals Route */}
                <Route path="deals" element={<Collection filterType="deals" />} />
                {/* General Collection Route (All) */}
                <Route path="collection" element={<Collection filterType="all" />} />
                {/* Specific Category Route */}
                <Route path="collection/:category" element={<Collection />} />

                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="account" element={<Account />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Admin Login (standalone, no layout) */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* Admin Dashboard Layout (protected) */}
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
            </Routes>
            <AIAssistant />
          </HashRouter>
        </AppContext.Provider>
      </AuthProvider>
    </AdminAuthProvider>
  );
};

export default App;
