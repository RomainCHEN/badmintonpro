import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useApp } from '../App';
import { Product } from '../types';
import { TRANSLATIONS, translateBrand, translateSpec, getProductName } from '../translations';
import { getProducts, getProductsOnSale, getProductsByCategory } from '../services/productService';

interface CollectionProps {
    filterType?: 'deals' | 'all';
}

const Collection: React.FC<CollectionProps> = ({ filterType }) => {
    const navigate = useNavigate();
    const { addToCart, language, wishlist, toggleWishlist } = useApp();
    const { category } = useParams();
    const t = TRANSLATIONS[language].collection;
    const tNav = TRANSLATIONS[language].nav;

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);

    // Load products from API
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    // Determine page context based on URL params or props
    const pageContext = useMemo(() => {
        if (filterType === 'deals') {
            return {
                title: language === 'en' ? 'Hot Deals' : '限时特惠',
                description: language === 'en' ? 'Limited time offers on professional badminton equipment.' : '专业羽毛球装备限时特惠。',
                breadcrumb: language === 'en' ? 'Deals' : '特惠',
                filter: (p: Product) => (p.salePercentage || 0) > 0
            };
        }

        const categoryMap: Record<string, string> = {
            'rackets': 'Rackets',
            'shoes': 'Footwear',
            'footwear': 'Footwear',
            'apparel': 'Apparel',
            'accessories': 'Accessories'
        };

        // Translation map for category titles
        const categoryTitleMap: Record<string, string> = {
            'Rackets': tNav.rackets,
            'Footwear': tNav.shoes,
            'Apparel': tNav.apparel,
            'Accessories': tNav.accessories
        };

        const targetCategory = category ? categoryMap[category.toLowerCase()] : null;

        if (targetCategory) {
            return {
                title: `${categoryTitleMap[targetCategory] || targetCategory}`,
                description: language === 'en'
                    ? `Professional grade ${targetCategory.toLowerCase()} for advanced players.`
                    : `专为进阶选手打造的专业级${categoryTitleMap[targetCategory]}。`,
                breadcrumb: categoryTitleMap[targetCategory] || targetCategory,
                filter: (p: Product) => p.category === targetCategory
            };
        }

        // Default to All
        return {
            title: language === 'en' ? 'Complete Collection' : '全系列产品',
            description: language === 'en' ? 'Browse our full inventory of premium badminton gear.' : '浏览我们全系列的高端羽毛球装备。',
            breadcrumb: language === 'en' ? 'All Products' : '所有产品',
            filter: () => true
        };
    }, [category, filterType, language, tNav]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // 1. Basic Category/Deal Filter
            if (!pageContext.filter(p)) return false;

            // 2. Brand Filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

            // 3. Weight Filter (Only applies if product has weight spec)
            if (selectedWeights.length > 0) {
                if (!p.specs?.weight) return false;
                // Check if "3U" is in "3U (85-89g)"
                const matchesWeight = selectedWeights.some(w => p.specs?.weight?.includes(w.split(' ')[0]));
                if (!matchesWeight) return false;
            }

            return true;
        });
    }, [products, pageContext, selectedBrands, selectedWeights]);

    const toggleFilter = (item: string, currentList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const renderProductCard = (product: Product) => {
        const isLiked = wishlist.some(item => item.id === product.id);

        return (
            <div key={product.id} className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    {product.isNew && <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded">{t.new}</span>}
                    {product.tags?.includes("Best Seller") && <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded">{t.bestSeller}</span>}
                    {product.salePercentage && <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">-{product.salePercentage}%</span>}

                    <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'filled' : ''}`}>favorite</span>
                    </button>

                    <img alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" src={product.image} />
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                        <button className="w-full bg-white text-slate-900 font-bold py-2 rounded shadow-lg hover:bg-slate-100 transition-colors text-sm">{t.quickView}</button>
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{translateBrand(product.brand, language)}</p>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>{getProductName(product, language)}</h3>
                    </div>
                    {product.specs && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.specs.weight && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{translateSpec('weight', product.specs.weight, language)}</span>}
                            {product.specs.balance && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{translateSpec('balance', product.specs.balance, language)}</span>}
                            {product.specs.flex && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{translateSpec('flex', product.specs.flex, language)}</span>}
                        </div>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                                {product.originalPrice && <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                            </div>
                        </div>
                        <button onClick={() => addToCart(product)} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-primary hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white">{language === 'cn' ? '首页' : 'Home'}</Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                            <Link to="/collection" className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white md:ml-2">{language === 'cn' ? '商店' : 'Shop'}</Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                            <span className="ml-1 text-sm font-medium text-slate-900 dark:text-white md:ml-2">{pageContext.breadcrumb}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{pageContext.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">{pageContext.description}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0 space-y-4">
                    {/* Simple filter implementation */}
                    <div className="space-y-3">
                        <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <span>{t.brand}</span>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-500">expand_more</span>
                            </summary>
                            <div className="border-t border-slate-200 dark:border-slate-700 p-4 pt-2">
                                <div className="space-y-2">
                                    {['Yonex', 'Victor', 'Li-Ning', 'Generic'].map((b, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group/item">
                                            <input
                                                type="checkbox"
                                                className="size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary"
                                                checked={selectedBrands.includes(b)}
                                                onChange={() => toggleFilter(b, selectedBrands, setSelectedBrands)}
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">{translateBrand(b, language)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </details>

                        {/* Rackets: Weight Filter */}
                        {(!category || category.toLowerCase() === 'rackets') && (
                            <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span>{t.weight}</span>
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-500">expand_more</span>
                                </summary>
                                <div className="border-t border-slate-200 dark:border-slate-700 p-4 pt-2">
                                    <div className="space-y-2">
                                        {[
                                            { value: '3U (85-89g)', label: language === 'cn' ? '3U (85-89克)' : '3U (85-89g)' },
                                            { value: '4U (80-84g)', label: language === 'cn' ? '4U (80-84克)' : '4U (80-84g)' },
                                            { value: '5U (75-79g)', label: language === 'cn' ? '5U (75-79克)' : '5U (75-79g)' }
                                        ].map((w, i) => (
                                            <label key={i} className="flex items-center gap-3 cursor-pointer group/item">
                                                <input
                                                    type="checkbox"
                                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary"
                                                    checked={selectedWeights.includes(w.value)}
                                                    onChange={() => toggleFilter(w.value, selectedWeights, setSelectedWeights)}
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">{w.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        )}

                        {/* Footwear: Size Filter */}
                        {category && (category.toLowerCase() === 'shoes' || category.toLowerCase() === 'footwear') && (
                            <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span>{language === 'cn' ? '尺码' : 'Size'}</span>
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-500">expand_more</span>
                                </summary>
                                <div className="border-t border-slate-200 dark:border-slate-700 p-4 pt-2">
                                    <div className="space-y-2">
                                        {[
                                            { value: 'US 6', label: 'US 6 / EU 38' },
                                            { value: 'US 7', label: 'US 7 / EU 39' },
                                            { value: 'US 8', label: 'US 8 / EU 40' },
                                            { value: 'US 9', label: 'US 9 / EU 41' },
                                            { value: 'US 10', label: 'US 10 / EU 42' },
                                            { value: 'US 11', label: 'US 11 / EU 43' },
                                            { value: 'US 12', label: 'US 12 / EU 44' }
                                        ].map((s, i) => (
                                            <label key={i} className="flex items-center gap-3 cursor-pointer group/item">
                                                <input
                                                    type="checkbox"
                                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">{s.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        )}

                        {/* Apparel: Size Filter */}
                        {category && category.toLowerCase() === 'apparel' && (
                            <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span>{language === 'cn' ? '尺码' : 'Size'}</span>
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-500">expand_more</span>
                                </summary>
                                <div className="border-t border-slate-200 dark:border-slate-700 p-4 pt-2">
                                    <div className="space-y-2">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s, i) => (
                                            <label key={i} className="flex items-center gap-3 cursor-pointer group/item">
                                                <input
                                                    type="checkbox"
                                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        )}

                        {/* Accessories: Price Range Filter */}
                        {category && category.toLowerCase() === 'accessories' && (
                            <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <span>{language === 'cn' ? '价格区间' : 'Price Range'}</span>
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-500">expand_more</span>
                                </summary>
                                <div className="border-t border-slate-200 dark:border-slate-700 p-4 pt-2">
                                    <div className="space-y-2">
                                        {[
                                            { value: 'under10', label: language === 'cn' ? '$10以下' : 'Under $10' },
                                            { value: '10to25', label: '$10 - $25' },
                                            { value: '25to50', label: '$25 - $50' },
                                            { value: 'over50', label: language === 'cn' ? '$50以上' : 'Over $50' }
                                        ].map((p, i) => (
                                            <label key={i} className="flex items-center gap-3 cursor-pointer group/item">
                                                <input
                                                    type="checkbox"
                                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary"
                                                />
                                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white">{p.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        )}
                    </div>
                </aside>

                {/* Product Grid Area */}
                <section className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{t.showing} <span className="text-slate-900 dark:text-white font-bold">1-{filteredProducts.length}</span> {t.of} <span className="text-slate-900 dark:text-white font-bold">{filteredProducts.length}</span> {t.results}</p>
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort" className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{t.sortBy}:</label>
                            <div className="relative min-w-[180px]">
                                <select id="sort" className="appearance-none w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 cursor-pointer">
                                    <option>{t.sortRecommended}</option>
                                    <option>{t.sortLowHigh}</option>
                                    <option>{t.sortHighLow}</option>
                                    <option>{t.sortNewest}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                    <span className="material-symbols-outlined text-lg">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(renderProductCard)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                            <p className="text-xl font-medium text-slate-600 dark:text-slate-400">{t.noResults}</p>
                            <button onClick={() => {
                                setSelectedBrands([]);
                                setSelectedWeights([]);
                                navigate('/collection');
                            }} className="mt-4 text-primary font-bold hover:underline">{t.viewAll}</button>
                        </div>
                    )}

                    {/* Pagination Mock */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:ring-slate-700 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">1</button>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800">2</button>
                                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:ring-slate-700 dark:hover:bg-slate-800"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                            </nav>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Collection;