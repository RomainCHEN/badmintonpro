import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLayout: React.FC = () => {
  const { isAdminAuthenticated, admin, adminLogout, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated - useEffect MUST be at top level, not conditionally called
  React.useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [loading, isAdminAuthenticated, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
          <p className="mt-4 text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-red-500">lock</span>
          <p className="mt-4 text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin', { replace: true });
  };

  // Navigation items
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/dashboard/inventory', label: 'Inventory', icon: 'inventory_2' },
    { path: '/admin/dashboard/orders', label: 'Orders', icon: 'shopping_bag' },
    { path: '/admin/dashboard/analytics', label: 'Analytics', icon: 'bar_chart' },
    { path: '/admin/dashboard/reviews', label: 'Reviews', icon: 'star' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const current = navItems.find(item => isActive(item.path));
    return current?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-full overflow-y-auto">
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">sports_tennis</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">BadmintonPro</h1>
            <span className="text-xs text-primary font-medium">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}

          <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">storefront</span>
            <span className="text-sm font-medium">View Store</span>
          </Link>
        </nav>

        {/* Bottom Links */}
        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-red-500">logout</span>
            <span className="text-sm font-medium hover:text-red-500">Log Out</span>
          </button>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{admin?.username || 'Admin'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Admin</Link>
            <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium">{getCurrentPageTitle()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="Search..." type="text" />
            </div>
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2632]"></span>
            </button>
            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Admin Access
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;