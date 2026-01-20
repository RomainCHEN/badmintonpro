import React from 'react';
import { useApp } from '../App';
import { ORDERS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { getProductName, TRANSLATIONS } from '../translations';

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, language } = useApp();
    const navigate = useNavigate();
    const t = TRANSLATIONS[language].cart;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="layout-container flex h-full grow flex-col max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10">
            {/* Progress Bar */}
            <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center w-full max-w-3xl relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded"></div>
                        <div className="absolute top-1/2 left-0 w-1/4 h-1 bg-primary -z-0 -translate-y-1/2 rounded"></div>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-white flex items-center justify-center shadow ring-4 ring-white dark:ring-background-dark">
                                    <span className="material-symbols-outlined text-sm md:text-base">shopping_cart</span>
                                </div>
                                <span className="text-xs md:text-sm font-bold text-primary bg-background-light dark:bg-background-dark px-2">{t.title}</span>
                            </div>
                            {['local_shipping', 'payments', 'check'].map((icon, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400 flex items-center justify-center shadow ring-4 ring-white dark:ring-background-dark">
                                        <span className="material-symbols-outlined text-sm md:text-base">{icon}</span>
                                    </div>
                                    <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 bg-background-light dark:bg-background-dark px-2">
                                        {icon === 'local_shipping' ? TRANSLATIONS[language].checkout.shippingInfo : icon === 'payments' ? TRANSLATIONS[language].checkout.paymentMethod : TRANSLATIONS[language].common.confirm}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Cart Items List */}
                <div className="flex flex-col w-full lg:w-2/3 gap-6">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-[#0d141b] dark:text-white text-2xl md:text-[32px] font-bold leading-tight">{t.title} ({cart.reduce((a, c) => a + c.quantity, 0)})</h1>
                        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 transition-colors">{TRANSLATIONS[language].common.clear}</button>
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart_off</span>
                            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">{t.empty}</p>
                            <Link to="/collection" className="mt-4 inline-block text-primary font-bold hover:underline">{t.continueShopping}</Link>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="bg-center bg-no-repeat bg-contain rounded-lg w-24 h-24 shrink-0 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" style={{ backgroundImage: `url('${item.image}')` }}></div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[#0d141b] dark:text-white text-lg font-semibold leading-normal">{getProductName(item, language)}</p>
                                        <p className="text-primary text-base font-bold leading-normal">${item.price.toFixed(2)}</p>
                                        {item.specs && <p className="text-gray-500 text-sm font-normal leading-normal">{Object.values(item.specs).join(' / ')}</p>}
                                        <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> {TRANSLATIONS[language].collection.inStock}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4 mt-2 md:mt-0">
                                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-[#f6f7f8] dark:bg-gray-800">
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-gray-600 dark:text-gray-300">-</button>
                                        <input className="w-10 p-0 text-center bg-transparent border-none focus:ring-0 text-sm font-medium" type="number" value={item.quantity} readOnly />
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-gray-600 dark:text-gray-300">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        <span className="md:hidden">{t.remove}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">{TRANSLATIONS[language].checkout.orderSummary}</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                <span>{t.subtotal}</span>
                                <span className="font-medium text-[#0d141b] dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                <span>{t.shipping}</span>
                                <span className="font-medium text-[#0d141b] dark:text-white">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                <span>{t.tax}</span>
                                <span className="font-medium text-[#0d141b] dark:text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-2 w-full">
                                    <input className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm py-2 px-3" placeholder={language === 'cn' ? '优惠码' : 'Promo code'} />
                                    <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">{TRANSLATIONS[language].common.apply}</button>
                                </label>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-[#0d141b] dark:text-white">{t.total}</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            disabled={cart.length === 0}
                            className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t.checkout}
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                            {language === 'cn' ? '256位SSL安全加密结算' : 'Secure Checkout with 256-bit SSL'}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#0d141b] dark:text-white">{language === 'cn' ? '结算进度' : 'Checkout Progress'}</span>
                            <span className="text-xs font-medium text-primary">{language === 'cn' ? '第1步/共4步' : 'Step 1 of 4'}</span>
                        </div>
                        <div className="rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden h-2 mb-3">
                            <div className="h-full bg-primary w-[25%] rounded-full"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                            {language === 'cn' ? '下一步：' : 'Next: '}<span className="text-[#0d141b] dark:text-white font-medium">{TRANSLATIONS[language].checkout.shippingInfo}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
                <h3 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span>
                    {TRANSLATIONS[language].admin.recentOrders}
                </h3>
                <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[#0d141b] dark:text-white">{TRANSLATIONS[language].orders.orderNumber}</th>
                                <th className="px-6 py-4 font-semibold text-[#0d141b] dark:text-white">{TRANSLATIONS[language].orders.date}</th>
                                <th className="px-6 py-4 font-semibold text-[#0d141b] dark:text-white">{TRANSLATIONS[language].orders.total}</th>
                                <th className="px-6 py-4 font-semibold text-[#0d141b] dark:text-white">{TRANSLATIONS[language].orders.status}</th>
                                <th className="px-6 py-4 font-semibold text-[#0d141b] dark:text-white text-right">{TRANSLATIONS[language].admin.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {ORDERS.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.date}</td>
                                    <td className="px-6 py-4 font-medium text-[#0d141b] dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Shipped' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
                                            {order.status === 'Shipped' ? (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                            ) : (
                                                <span className="material-symbols-outlined text-[14px]">check</span>
                                            )}
                                            {order.status === 'Shipped' ? TRANSLATIONS[language].orders.shipped : order.status === 'Delivered' ? TRANSLATIONS[language].orders.delivered : order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`${order.status === 'Shipped' ? 'text-primary hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm flex items-center justify-end gap-1 w-full`}>
                                            {order.status === 'Shipped' ? TRANSLATIONS[language].orders.trackOrder : TRANSLATIONS[language].orders.details}
                                            {order.status === 'Shipped' && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Cart;
