import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import { Product, Order } from '../types';

const AdminAnalytics: React.FC = () => {
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

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Category breakdown
    const categoryData = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Top products by review count
    const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

    // Order status breakdown
    const orderStatusData = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Simple bar chart data (simulated monthly)
    const monthlyData = [
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18200 },
        { month: 'Apr', revenue: 14800 },
        { month: 'May', revenue: 21000 },
        { month: 'Jun', revenue: 19500 },
    ];
    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

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
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your store's performance and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Average Order Value</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${avgOrderValue.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-2">↑ 5% from last month</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{orders.length}</p>
                    <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <p className="text-sm text-slate-500">Total Products</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{products.length}</p>
                    <p className="text-xs text-slate-500 mt-2">Active in catalog</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Monthly Revenue</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-primary/20 rounded-t-md relative group hover:bg-primary/30 transition-colors"
                                    style={{ height: `${(d.revenue / maxRevenue) * 200}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${d.revenue.toLocaleString()}
                                    </div>
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                                        style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-slate-500 mt-2">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Products by Category</h2>
                    <div className="space-y-4">
                        {Object.entries(categoryData).map(([category, count]) => {
                            const percentage = (count / products.length) * 100;
                            const colors: Record<string, string> = {
                                'Rackets': 'bg-blue-500',
                                'Footwear': 'bg-green-500',
                                'Apparel': 'bg-purple-500',
                                'Accessories': 'bg-orange-500',
                            };
                            return (
                                <div key={category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-900 dark:text-white">{category}</span>
                                        <span className="text-slate-500">{count} products ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[category] || 'bg-slate-500'} rounded-full transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Products by Reviews</h2>
                    <div className="space-y-3">
                        {topProducts.map((product, i) => (
                            <div key={product.id} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')` }}></div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.reviews} reviews • {product.rating}★</p>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">${product.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Status Distribution</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(orderStatusData).map(([status, count]) => {
                            const colors: Record<string, string> = {
                                'Processing': 'bg-yellow-500',
                                'Shipped': 'bg-blue-500',
                                'Delivered': 'bg-green-500',
                                'Cancelled': 'bg-red-500',
                            };
                            return (
                                <div key={status} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-slate-500'}`}></div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{count}</p>
                                        <p className="text-xs text-slate-500">{status}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(orderStatusData).length === 0 && (
                            <p className="col-span-2 text-center text-slate-500 py-4">No order data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
