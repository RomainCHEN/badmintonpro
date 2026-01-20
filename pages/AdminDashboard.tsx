import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import { Product, Order } from '../types';

const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [productsData, ordersData] = await Promise.all([
                getProducts(),
                getOrders(),
            ]);
            setProducts(productsData);
            setOrders(ordersData);
            setLoading(false);
        };
        loadData();
    }, []);

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's an overview of your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Products</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">inventory_2</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        <span className="text-green-600 font-medium">Active</span> in catalog
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">shopping_bag</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        <span className="text-green-600 font-medium">↑ 12%</span> from last month
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Revenue</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">payments</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        <span className="text-green-600 font-medium">↑ 8%</span> from last month
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock Alerts</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{lowStockProducts}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        <span className="text-red-600 font-medium">Needs attention</span>
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                        <Link to="/admin/dashboard/orders" className="text-sm text-primary hover:text-blue-600">View All →</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No orders yet</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-lg">receipt</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">{order.id}</p>
                                            <p className="text-xs text-slate-500">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>{order.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">add_box</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Add Product</p>
                                <p className="text-xs text-slate-500">Add new item to catalog</p>
                            </div>
                        </Link>
                        <Link to="/admin/dashboard/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600">local_shipping</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Manage Orders</p>
                                <p className="text-xs text-slate-500">Update order statuses</p>
                            </div>
                        </Link>
                        <Link to="/admin/dashboard/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600">bar_chart</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">View Analytics</p>
                                <p className="text-xs text-slate-500">Sales and performance</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Low Stock Alert Table */}
            {lowStockProducts > 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        Low Stock Products
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                                    <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {products.filter(p => p.stock < 10).map(product => (
                                    <tr key={product.id}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')` }}></div>
                                                <span className="font-medium text-slate-900 dark:text-white text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-sm text-slate-500">{product.sku || 'N/A'}</td>
                                        <td className="py-3">
                                            <span className="text-red-600 font-bold">{product.stock}</span>
                                        </td>
                                        <td className="py-3">
                                            <Link to="/admin/dashboard" className="text-primary text-sm hover:underline">Restock</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
