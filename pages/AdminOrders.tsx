import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { updateOrderStatus } from '../services/adminService';
import { Order } from '../types';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('All');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
    };

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        const success = await updateOrderStatus(orderId, newStatus);
        if (success) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } else {
            alert('Failed to update order status. Demo mode: changes are simulated.');
            // Still update locally for demo
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
    };

    const filteredOrders = filter === 'All'
        ? orders
        : orders.filter(o => o.status === filter);

    const statusColors: Record<string, string> = {
        'Processing': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        'Shipped': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex gap-2">
                    {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-sm text-slate-500">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="animate-spin material-symbols-outlined text-3xl text-primary">progress_activity</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">shopping_bag</span>
                        <p className="text-slate-500">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-slate-900 dark:text-white">{order.id}</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">{order.date}</td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => {
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <div key={status} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{count}</p>
                            <p className={`text-sm font-medium ${status === 'Cancelled' ? 'text-red-600' : status === 'Delivered' ? 'text-green-600' : 'text-slate-500'}`}>{status}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminOrders;
