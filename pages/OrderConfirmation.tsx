import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, OrderDetails } from '../services/orderService';

const OrderConfirmation: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
            {/* Success Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Order Confirmed!</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Thank you for your purchase. Your order has been received.
                </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Order Number</p>
                            <p className="text-2xl font-bold">{orderId}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <span className="material-symbols-outlined">local_shipping</span>
                            <span className="font-medium">{order?.status || 'Processing'}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Estimated Delivery */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">schedule</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order?.shippingAddress && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">location_on</span>
                                Shipping Address
                            </h3>
                            <div className="text-gray-600 dark:text-gray-400 pl-8">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    {order?.items && order.items.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">inventory_2</span>
                                Order Items
                            </h3>
                            <div className="space-y-3 pl-8">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${item.image}')` }}></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Total */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Order Total</span>
                            <span className="text-2xl font-bold text-primary">${order?.total?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">tips_and_updates</span>
                    What Happens Next?
                </h3>
                <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-lg">mail</span>
                        <p>You'll receive an order confirmation email shortly</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-lg">inventory</span>
                        <p>We'll prepare your items for shipping within 24 hours</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-lg">notifications</span>
                        <p>Tracking information will be sent once your order ships</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/account"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-300 dark:border-gray-700 rounded-lg font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined">receipt_long</span>
                    View Order History
                </Link>
                <Link
                    to="/collection"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all"
                >
                    Continue Shopping
                    <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
