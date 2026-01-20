import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App';
import { TRANSLATIONS, getProductName, translateBrand } from '../translations';
import { getTrendingProducts } from '../services/productService';
import { Product } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, language, wishlist, toggleWishlist } = useApp();
  const t = TRANSLATIONS[language].home;
  const tCol = TRANSLATIONS[language].collection;

  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getTrendingProducts(4);
      setTrendingProducts(products);
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-10 py-6 max-w-[1400px] mx-auto gap-8">
      {/* Hero Section */}
      <section className="w-full">
        <div className="relative w-full rounded-2xl overflow-hidden min-h-[480px] flex flex-col justify-end p-8 md:p-16 bg-cover bg-center group"
          style={{ backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDi1F7wEi5yG011JKWlKN8l70cHRzBLIu1DKG0QC60P6yPQ7D7eXyovIP_qHSukm0nisXdKVbAcpCvFklodkdyoUH6hwFPJ7TGHIvn42j18nfnqqI3rgso4twVGEv1L2OvI_o_1G16YEU8w1QmuBrXwT2iSpRpzS77uBNZDc0fXOwDPfd5O0E9kP2Eq_HKFl9mW7WPzSxBYiTvVpUO26JlwB4koiChU5wiier7KsC5Q0GkhcI0Hs4Ogtmupg8xq8OyNrUf8qos8TA")' }}>
          <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
            <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Limited Time Offer
            </div>
            <h2 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.02em] drop-shadow-lg">
              {t.heroTitle}
            </h2>
            <p className="text-gray-100 text-lg md:text-xl font-light max-w-lg drop-shadow-md">
              {t.heroSubtitle}
            </p>
            <div className="flex gap-4 mt-4">
              <button onClick={() => navigate('/deals')} className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/30">
                {t.shopDeals}
              </button>
              <button onClick={() => navigate('/collection')} className="flex items-center justify-center rounded-lg h-12 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-base font-bold transition-colors">
                {t.viewCollection}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#0d141b] dark:text-white">{t.shopByCategory}</h3>
          <Link to="/collection" className="text-primary font-medium hover:underline flex items-center gap-1">
            {t.viewAll} <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: t.proRackets, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP_d_Wiplv2k8F-804Fwncwb6naUXaAEH3Zykfb8AG5IGrt4LqxvAg4FNBzaAkSfyjr6-_iVDecSECuXO2r6WQDPLfczb11skqzkgiCLmgbBoR9EBxjguMpk8eKnBVYIHX2Cot4x7uvgXvYJN8hZoZBw5lb6mQL-VP3qU8t0UHovsNZOvJGW8nna93lkMlBl1nPovMaez_HZrA2beBbLbUY5W7yZehwm2_GwxaiTGSUmYoqLxuwOt9QLv07XRLk1xwzkvmKKymaA", label: t.series, link: '/collection/rackets' },
            { name: t.perfShoes, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeVWt96OrivZZUD6oLgZkAV_67MsvwDX18_31akhkc5ryGoR2a29MY4hVBSHXv3GwlCw6IR9AhuQmJNjDFujVj5mLX2XxXFgKx5uYyhCBTfX8XoLxH1q_GnlPW6KSjiOtr8mJUAishpMP9euD-pY5RdCOrVXUY5ys0XWdEvoQywdU7N-KDTbwAswyDAAYTZkDEfd3cr5VGhnj-YZcjQlCBHGKqRCFT8F-wRGolInoGKPKmsiOMdfgG8ESk7G-04FMQIDd_omI4SA", label: t.footwear, link: '/collection/shoes' },
            { name: t.clothing, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5BtJhZqh4HHZ24Ue6NTBJQDEJQDUdqL_oOTmlzoaaO0KqdEES-1MB0fMGEfJj_tZ9TA3VYRW41toNIcPylWcoD_b7Mt0tECMyimK7HrgzSaqAi3IuQmy8tzD_5nYktVZG53dkFFr28InWsp5ZTwoTi8NIWS4OkT5lgajaCMpket0wex9wOChwyL6ceBN_O8TTBFGUURCaJJagzSQPD_dB-Ioe83CodoGSgtQ9KkSgTNZBbq14I9GCccU9hviMOsSJcqw_MEbGng", label: t.clothing, link: '/collection/apparel' },
            { name: t.essentials, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB2WlxhwyQ5Ew1RB3MufeTDr0kasxOfEVElGp1LNekilwLVvhrunP-akaeK3_Op_IbaOjm2dMfYjR-gx3t5kL2rhCklRdsWTpNZkyfRkpm3v-S-j4hTU1GNhQG6rW8l-OeAlaUTkTPQZFdVevlp7XUiHbyNEwUrIuZS1jFCZ6lDwwzjGnNa0CUjuEYJj26NoAHNsvHcyZ71Rkc0Qr_WGttnLaErVhDjEtNDNG_Sd0uHYQpWWcd021zDtFVR_PaTnqkU9fkWbMeaQ", label: t.gear, link: '/collection/accessories' },
          ].map((cat, idx) => (
            <Link key={idx} to={cat.link} className="group relative overflow-hidden rounded-xl aspect-[4/5] md:aspect-square lg:aspect-[3/4]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${cat.img}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1 block">{cat.label}</span>
                <h4 className="text-white text-2xl font-bold group-hover:text-primary transition-colors">{cat.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="w-full flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-[#0d141b] dark:text-white">{t.trending}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.trendingSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => {
            const isLiked = wishlist.some(item => item.id === product.id);
            return (
              <div key={product.id} className="group flex flex-col gap-3 bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative w-full aspect-square bg-surface-light dark:bg-background-dark rounded-lg overflow-hidden" onClick={() => navigate(`/product/${product.id}`)}>
                  {product.salePercentage && <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">-{product.salePercentage}%</div>}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors z-10 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'filled' : ''}`}>favorite</span>
                  </button>

                  <img alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300" src={product.image} />
                </div>
                <div className="flex flex-col gap-1 px-1">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-yellow-400 text-[14px]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined ${i < Math.floor(product.rating) ? 'filled' : ''} text-[16px]`}>{i < Math.floor(product.rating) ? 'star' : (i < product.rating ? 'star_half' : 'star')}</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">({product.reviews})</span>
                  </div>
                  <h4 className="text-[#0d141b] dark:text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors" onClick={() => navigate(`/product/${product.id}`)}>{getProductName(product, language)}</h4>
                  <p className="text-gray-500 text-sm">{translateBrand(product.brand, language)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#0d141b] dark:text-white">${product.price.toFixed(2)}</span>
                      {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;