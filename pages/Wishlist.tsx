import React from 'react';
import { useApp } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex-1 px-4 md:px-10 py-6 md:py-10 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm text-[#4c739a] dark:text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/" className="hover:text-primary transition-colors">Account</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
                <p className="text-[#4c739a] dark:text-slate-400">{wishlist.length} items saved for later</p>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center justify-center h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="truncate">Share Wishlist</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    <span className="truncate">Move all to Cart</span>
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            <button className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 transition-colors">
                <span className="text-sm font-medium">All Items</span>
            </button>
            {['Rackets', 'Shoes', 'Apparel'].map((filter, i) => (
                <button key={i} className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#e7edf3] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 transition-colors">
                    <span className="text-sm font-medium">{filter}</span>
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.length === 0 ? (
                 <div className="col-span-full mt-12 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">favorite_border</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Looking for more gear?</h3>
                    <p className="text-[#4c739a] dark:text-slate-400 mt-2 mb-6 max-w-md mx-auto">Browse our latest collection of professional rackets and performance footwear to add to your wishlist.</p>
                    <button onClick={() => navigate('/collection')} className="bg-primary hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                wishlist.map(product => (
                    <div key={product.id} className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={()=>navigate(`/product/${product.id}`)}>
                            {product.salePercentage && <div className="absolute top-3 left-3 z-10"><span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded uppercase tracking-wider">Sale</span></div>}
                             <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors shadow-sm" title="Remove from wishlist">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                            <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" style={{backgroundImage: `url('${product.image}')`}}></div>
                        </div>
                        <div className="flex flex-col flex-1 p-4 gap-3">
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-snug line-clamp-2 mb-1" onClick={()=>navigate(`/product/${product.id}`)}>{product.name}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="material-symbols-outlined text-[18px] text-yellow-400 filled">star</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
                                    <span className="text-sm text-slate-400">({product.reviews})</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                                    {product.originalPrice && <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <button onClick={() => addToCart(product)} className="w-full flex items-center justify-center gap-2 bg-[#e7edf3] dark:bg-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-900 dark:text-white font-bold py-2.5 rounded-lg transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;