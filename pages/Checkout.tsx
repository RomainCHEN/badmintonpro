import React, { useState } from 'react';
import { useApp } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, ShippingAddress } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const Checkout: React.FC = () => {
    const { cart, clearCart, language } = useApp();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 150 ? 0 : 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const order = await createOrder({
                items: cart,
                shippingAddress: formData,
                subtotal,
                shipping,
                tax,
                total,
                userId: user?.id, // Associate order with logged-in user
            });

            if (order) {
                clearCart();
                navigate(`/order-confirmation/${order.id}`);
            } else {
                setError('Failed to create order. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex-1 px-4 md:px-10 py-20 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart_off</span>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some items to your cart before checking out.</p>
                <Link to="/collection" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {/* Progress Bar */}
            <div className="mb-10">
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center w-full max-w-3xl relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded"></div>
                        <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-primary -z-0 -translate-y-1/2 rounded"></div>
                        <div className="flex justify-between w-full">
                            {[
                                { icon: 'shopping_cart', label: 'Cart', active: false, completed: true },
                                { icon: 'local_shipping', label: 'Shipping', active: true, completed: false },
                                { icon: 'payments', label: 'Payment', active: false, completed: false },
                                { icon: 'check', label: 'Confirm', active: false, completed: false },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow ring-4 ring-white dark:ring-background-dark ${step.active ? 'bg-primary text-white' : step.completed ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-base">{step.completed ? 'check' : step.icon}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${step.active ? 'text-primary' : step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            Shipping Information
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="123 Main Street, Apt 4B"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country *</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="USA">United States</option>
                                    <option value="CAN">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="CHN">China</option>
                                </select>
                            </div>

                            {/* Payment Section (Simulated) */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    Payment Method
                                </h3>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-600">info</span>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            This is a demo checkout. No real payment will be processed.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <input type="radio" checked readOnly className="text-primary" />
                                    <span className="material-symbols-outlined text-gray-500">credit_card</span>
                                    <span className="font-medium">Credit Card (Demo)</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${item.image}')` }}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                        <p className="text-primary font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-200 dark:border-gray-800">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {shipping > 0 && (
                            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Free shipping on orders over $150
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
