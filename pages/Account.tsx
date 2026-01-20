import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Account: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/account' } } });
            return;
        }

        const fetchOrders = async () => {
            // Fetch orders for the current user
            const data = await getOrders(user?.id);
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, [isAuthenticated, navigate, user?.id]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">My Account</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Log Out
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-8">
                {[
                    { id: 'orders', label: 'Order History', icon: 'receipt_long' },
                    { id: 'addresses', label: 'Addresses', icon: 'location_on' },
                    { id: 'settings', label: 'Settings', icon: 'settings' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-[2px] ${activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h2>
                        <span className="text-sm text-gray-500">{orders.length} orders</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="animate-spin material-symbols-outlined text-3xl text-primary">progress_activity</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_bag</span>
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                            <Link to="/collection" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.date}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : order.status === 'Shipped'
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                    {order.status === 'Shipped' && (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                        </span>
                                                    )}
                                                    {order.status === 'Delivered' && <span className="material-symbols-outlined text-[14px]">check</span>}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/order-confirmation/${order.id}`}
                                                    className="text-primary hover:text-blue-700 font-medium text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add Address
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Default Address */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-2 border-primary relative">
                            <span className="absolute top-3 right-3 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Default</span>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Home</h3>
                            <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                                <p>Demo User</p>
                                <p>123 Demo Street</p>
                                <p>Demo City, DC 12345</p>
                                <p>United States</p>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button className="text-sm text-primary font-medium hover:underline">Edit</button>
                                <button className="text-sm text-gray-500 font-medium hover:text-red-500">Delete</button>
                            </div>
                        </div>

                        {/* Add New Card */}
                        <button className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors min-h-[200px]">
                            <span className="material-symbols-outlined text-4xl text-gray-400">add_location</span>
                            <span className="text-gray-500 font-medium">Add New Address</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive order updates via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive shipping alerts via SMS</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Newsletter</h3>
                                    <p className="text-sm text-gray-500">Weekly deals and new arrivals</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
                        <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
