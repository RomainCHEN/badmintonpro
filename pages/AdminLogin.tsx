import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { adminLogin, isAdminAuthenticated } = useAdminAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAdminAuthenticated) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAdminAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { success, error: loginError } = await adminLogin(username, password);

        if (!success) {
            setError(loginError || 'Login failed');
            setLoading(false);
        } else {
            navigate('/admin/dashboard', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg mb-4">
                        <span className="material-symbols-outlined text-3xl text-white">admin_panel_settings</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="mt-2 text-slate-400">BadmintonPro Management System</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg">error</span>
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">person</span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter admin username"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">login</span>
                                    Access Admin Panel
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-start gap-3 text-slate-400 text-xs">
                            <span className="material-symbols-outlined text-sm mt-0.5">security</span>
                            <p>This is a secure area. Unauthorized access attempts are logged and monitored.</p>
                        </div>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-400 mt-0.5">info</span>
                        <div>
                            <p className="text-sm text-amber-300 font-medium">Demo Credentials</p>
                            <p className="text-xs text-amber-200/80 mt-1">
                                Username: <code className="bg-white/10 px-1 rounded">admin</code><br />
                                Password: <code className="bg-white/10 px-1 rounded">admin123</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Store */}
                <p className="mt-6 text-center">
                    <a href="#/" className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Store
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
