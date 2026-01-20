import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { TRANSLATIONS } from '../translations';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { cart, language, toggleLanguage } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const t = TRANSLATIONS[language].nav;

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] dark:border-b-[#2a3642] px-6 py-4 bg-surface-light dark:bg-background-dark">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined text-[32px]">sports_tennis</span>
          </div>
          <h1 className="text-[#0d141b] dark:text-white text-xl font-black leading-tight tracking-[-0.015em] hidden md:block">BadmintonPro</h1>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-col min-w-60 w-96 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <label className="flex w-full items-stretch rounded-lg h-10 bg-[#e7edf3] dark:bg-surface-dark focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="text-[#4c739a] flex items-center justify-center pl-4 pr-2">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-[#4c739a] text-sm font-normal focus:ring-0 focus:outline-none"
              placeholder={t.searchPlaceholder}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 mr-4">
            <Link to="/collection/rackets" className="text-sm font-medium hover:text-primary transition-colors">{t.rackets}</Link>
            <Link to="/collection/shoes" className="text-sm font-medium hover:text-primary transition-colors">{t.shoes}</Link>
            <Link to="/collection/apparel" className="text-sm font-medium hover:text-primary transition-colors">{t.apparel}</Link>
          </div>

          <button
            onClick={toggleLanguage}
            className="hidden lg:flex items-center justify-center rounded-lg h-10 bg-surface-light dark:bg-surface-dark text-[#0d141b] dark:text-white px-3 text-sm font-bold tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <span className="material-symbols-outlined text-[20px] mr-2">translate</span>
            <span className={language === 'en' ? 'text-primary' : ''}>EN</span>
            <span className="mx-1">|</span>
            <span className={language === 'cn' ? 'text-primary' : ''}>CN</span>
          </button>

          <Link to="/wishlist" className="flex items-center justify-center rounded-lg h-10 w-10 bg-surface-light dark:bg-surface-dark text-[#0d141b] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary">favorite</span>
          </Link>

          <Link to="/cart" className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary text-white hover:bg-primary-dark transition-colors group relative shadow-md">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border border-white text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg h-10 px-3 bg-surface-light dark:bg-surface-dark text-[#0d141b] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate hidden sm:block">{user?.name || 'User'}</span>
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        My Account
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Order History
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-surface-light dark:bg-surface-dark text-[#0d141b] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 text-sm font-medium"
                >
                  {language === 'en' ? 'Login' : '登录'}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-bold shadow-sm"
                >
                  {language === 'en' ? 'Sign Up' : '注册'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full bg-background-light dark:bg-background-dark">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-background-dark py-10 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">sports_tennis</span>
              <h5 className="text-lg font-bold">BadmintonPro</h5>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your trusted partner for professional badminton equipment.</p>
          </div>
          <div>
            <h6 className="font-bold mb-3">Shop</h6>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li><Link to="/collection/rackets" className="hover:text-primary">{t.rackets}</Link></li>
              <li><Link to="/collection/shoes" className="hover:text-primary">{t.shoes}</Link></li>
              <li><Link to="/collection/apparel" className="hover:text-primary">{t.apparel}</Link></li>
              <li><Link to="/collection/accessories" className="hover:text-primary">{t.accessories}</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-3">Support</h6>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li><Link to="/" className="hover:text-primary">Order Status</Link></li>
              <li><Link to="/" className="hover:text-primary">Returns</Link></li>
              <li><Link to="/" className="hover:text-primary">Size Guide</Link></li>
              <li><Link to="/" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 BadmintonPro. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
