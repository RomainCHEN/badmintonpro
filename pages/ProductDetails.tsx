import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import { TRANSLATIONS, translateSpec, translateBrand, translateCategory, getProductName, getProductDescription } from '../translations';
import { getProductById } from '../services/productService';
import { getReviewsByProductId, createReview } from '../services/reviewService';
import { getProductImages } from '../services/imageService';
import { Product, Review, ProductImage } from '../types';
import { PRODUCTS, REVIEWS } from '../constants';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const { addToCart, toggleWishlist, wishlist, language } = useApp();
    const t = TRANSLATIONS[language].product;

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, text: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                // First fetch the product
                const productData = await getProductById(id);
                setProduct(productData || PRODUCTS[0]);

                // Then fetch reviews and images in parallel (images needs product.image)
                const [reviewsData, imagesData] = await Promise.all([
                    getReviewsByProductId(id),
                    getProductImages(id, productData?.image)
                ]);

                setReviews(reviewsData.length > 0 ? reviewsData : REVIEWS);

                // If images loaded from service, use them; otherwise create from product image
                if (imagesData.length > 0) {
                    setImages(imagesData);
                } else if (productData) {
                    setImages([{
                        id: '1',
                        productId: id,
                        imageUrl: productData.image,
                        altText: productData.name,
                        displayOrder: 0,
                        isPrimary: true
                    }]);
                }
            }
            setLoading(false);
        };
        loadData();
    }, [id]);


    // Handle review submission
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !reviewForm.userName || !reviewForm.text) return;

        setSubmittingReview(true);
        const newReview = await createReview(id, reviewForm);

        if (newReview) {
            setReviews(prev => [newReview, ...prev]);
            setReviewForm({ userName: '', rating: 5, text: '' });
            setShowReviewModal(false);

            // Update product review count
            if (product) {
                setProduct(prev => prev ? { ...prev, reviews: prev.reviews + 1 } : prev);
            }
        }
        setSubmittingReview(false);
    };

    if (loading || !product) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    const inWishlist = wishlist.some(item => item.id === product.id);
    const currentImage = images[selectedImageIndex]?.imageUrl || product.image;

    return (
        <div className="layout-container flex grow flex-col py-6 px-4 md:px-10 lg:px-20 xl:px-40">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-2 text-sm">
                <Link to="/" className="text-[#4c739a] dark:text-gray-400 font-medium hover:underline">{t.home}</Link>
                <span className="text-[#4c739a] dark:text-gray-400">/</span>
                <Link to="/collection" className="text-[#4c739a] dark:text-gray-400 font-medium hover:underline">{translateCategory(product.category, language)}</Link>
                <span className="text-[#4c739a] dark:text-gray-400">/</span>
                <span aria-current="page" className="font-medium text-[#0d141b] dark:text-white">{getProductName(product, language)}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Image Gallery */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Main Image */}
                    <div
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 shadow-sm cursor-zoom-in group"
                        onClick={() => setShowLightbox(true)}
                    >
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {product.tags?.includes("Best Seller") && (
                                <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
                                    Best Seller
                                </span>
                            )}
                            {product.salePercentage && (
                                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-bold text-green-700 dark:text-green-400">
                                    -{product.salePercentage}%
                                </span>
                            )}
                        </div>
                        <div
                            className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url('${currentImage}')` }}
                        />
                        {/* Zoom hint */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-sm">zoom_in</span>
                            Click to zoom
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImageIndex(i)}
                                className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${i === selectedImageIndex
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                    } bg-white dark:bg-gray-800 p-2`}
                            >
                                <div
                                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url('${img.imageUrl}')` }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400 material-symbols-outlined text-[20px] filled">star</span>
                            <span className="text-sm font-semibold">{product.rating}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviews} {t.reviews})</span>
                        </div>
                        <h1 className="text-3xl font-bold leading-tight text-[#0d141b] dark:text-white lg:text-4xl">{getProductName(product, language)}</h1>
                        <p className="mt-2 text-base leading-relaxed text-[#4c739a] dark:text-gray-300">
                            {getProductDescription(product, language) || (language === 'cn'
                                ? `使用 ${getProductName(product, language)} 主宰球场。搭载旋转发生器系统，快速回位，持续进攻。`
                                : `Dominate the court with the devastating power of the ${product.name}. Featuring the Rotational Generator System for quick recovery and continuous attacks.`)}
                        </p>
                    </div>

                    <div className="flex items-end gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                        {product.originalPrice && <span className="mb-1 text-lg text-gray-400 decoration-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                        {product.salePercentage && <span className="mb-1 ml-auto rounded bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400">{product.salePercentage}% OFF</span>}
                    </div>

                    {/* Specs Grid */}
                    {product.specs && (
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(product.specs).map(([key, value]) => {
                                const specLabels: Record<string, { en: string; cn: string }> = {
                                    weight: { en: 'Weight', cn: '重量' },
                                    balance: { en: 'Balance', cn: '平衡点' },
                                    flex: { en: 'Flex', cn: '中杆硬度' },
                                    grip: { en: 'Grip', cn: '握柄尺寸' }
                                };
                                const label = specLabels[key]?.[language] || key;
                                const translatedValue = translateSpec(key, value as string, language);
                                return (
                                    <div key={key} className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <span className="material-symbols-outlined text-gray-400">
                                            {key === 'weight' ? 'scale' : key === 'balance' ? 'balance' : key === 'flex' ? 'bolt' : 'handshake'}
                                        </span>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                                            <p className="font-medium">{translatedValue}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Category-specific Selectors */}
                    <div className="flex flex-col gap-4 py-4">
                        {/* Rackets: String Tension */}
                        {product.category === 'Rackets' && (
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-[#0d141b] dark:text-white">
                                    {language === 'cn' ? '穿线磅数' : 'String Tension (lbs)'}
                                </span>
                                <div className="relative">
                                    <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>{language === 'cn' ? '空拍（不穿线）' : 'Unstrung (Frame Only)'}</option>
                                        <option>{language === 'cn' ? '24磅（推荐）' : '24 lbs (Recommended)'}</option>
                                        <option>{language === 'cn' ? '25磅' : '25 lbs'}</option>
                                        <option>{language === 'cn' ? '26磅' : '26 lbs'}</option>
                                        <option>{language === 'cn' ? '27磅' : '27 lbs'}</option>
                                        <option>{language === 'cn' ? '28磅' : '28 lbs'}</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                        )}

                        {/* Shoes: Size */}
                        {product.category === 'Shoes' && (
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-[#0d141b] dark:text-white">
                                    {language === 'cn' ? '尺码' : 'Size (US)'}
                                </span>
                                <div className="relative">
                                    <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>{language === 'cn' ? '请选择尺码' : 'Select Size'}</option>
                                        <option>US 6 / EU 38</option>
                                        <option>US 7 / EU 39</option>
                                        <option>US 8 / EU 40</option>
                                        <option>US 9 / EU 41</option>
                                        <option>US 10 / EU 42</option>
                                        <option>US 11 / EU 43</option>
                                        <option>US 12 / EU 44</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                        )}

                        {/* Apparel: Size */}
                        {product.category === 'Apparel' && (
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-[#0d141b] dark:text-white">
                                    {language === 'cn' ? '尺码' : 'Size'}
                                </span>
                                <div className="relative">
                                    <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>{language === 'cn' ? '请选择尺码' : 'Select Size'}</option>
                                        <option>XS</option>
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                        <option>XL</option>
                                        <option>XXL</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                        )}

                        {/* Shuttlecocks: Speed */}
                        {product.category === 'Shuttlecocks' && (
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-[#0d141b] dark:text-white">
                                    {language === 'cn' ? '速度/球速' : 'Shuttle Speed'}
                                </span>
                                <div className="relative">
                                    <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>{language === 'cn' ? '请选择球速' : 'Select Speed'}</option>
                                        <option>{language === 'cn' ? '76速（慢速/高海拔）' : '76 (Slow / High Altitude)'}</option>
                                        <option>{language === 'cn' ? '77速（中慢速）' : '77 (Medium-Slow)'}</option>
                                        <option>{language === 'cn' ? '78速（中速/推荐）' : '78 (Medium / Recommended)'}</option>
                                        <option>{language === 'cn' ? '79速（中快速）' : '79 (Medium-Fast)'}</option>
                                        <option>{language === 'cn' ? '80速（快速/低海拔）' : '80 (Fast / Low Altitude)'}</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                        )}

                        {/* Accessories (Grip, Bags, etc.): Quantity or just add to cart */}
                        {product.category === 'Accessories' && (
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-[#0d141b] dark:text-white">
                                    {language === 'cn' ? '数量' : 'Quantity'}
                                </span>
                                <div className="relative">
                                    <select className="h-11 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 pr-10 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>{language === 'cn' ? '10（优惠装）' : '10 (Value Pack)'}</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <button onClick={() => addToCart(product)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-600 active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined">shopping_cart</span>
                                {t.addToCart}
                            </button>
                            <button onClick={() => toggleWishlist(product)} className="flex aspect-square items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-14 group">
                                <span className={`material-symbols-outlined ${inWishlist ? 'text-red-500 filled' : 'text-gray-500 dark:text-gray-400'} group-hover:text-red-500 transition-colors`}>favorite</span>
                            </button>
                        </div>
                        <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                            {t.inStock}
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-4 flex gap-6 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="material-symbols-outlined text-2xl">verified_user</span>
                            <span>{t.authentic}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="material-symbols-outlined text-2xl">local_shipping</span>
                            <span>{t.freeShipping}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="material-symbols-outlined text-2xl">published_with_changes</span>
                            <span>{t.returns}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-16 lg:mt-24">
                <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">Customer {t.reviews}</h2>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="text-4xl font-bold text-[#0d141b] dark:text-white">{product.rating}</span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined ${i < Math.floor(product.rating) ? 'filled' : ''}`}>
                                            {i < Math.floor(product.rating) ? 'star' : 'star_half'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t.basedOn} {product.reviews} {t.reviews.toLowerCase()}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">rate_review</span>
                        {t.writeReview}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map(review => (
                        <div key={review.id} className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full ${review.avatarColor} flex items-center justify-center font-bold text-sm`}>
                                        {review.user.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#0d141b] dark:text-white">{review.user}</p>
                                        {review.verified && <p className="text-xs text-gray-500">{t.verified}</p>}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-[18px] ${i < Math.floor(review.rating) ? 'filled' : 'text-gray-300'}`}>star</span>
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed text-[#4c739a] dark:text-gray-300">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lightbox Modal */}
            {showLightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setShowLightbox(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
                        onClick={() => setShowLightbox(false)}
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>

                    {/* Navigation arrows */}
                    <button
                        className="absolute left-4 p-3 text-white/80 hover:text-white transition-colors disabled:opacity-30"
                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => Math.max(0, i - 1)); }}
                        disabled={selectedImageIndex === 0}
                    >
                        <span className="material-symbols-outlined text-4xl">chevron_left</span>
                    </button>
                    <button
                        className="absolute right-4 p-3 text-white/80 hover:text-white transition-colors disabled:opacity-30"
                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => Math.min(images.length - 1, i + 1)); }}
                        disabled={selectedImageIndex === images.length - 1}
                    >
                        <span className="material-symbols-outlined text-4xl">chevron_right</span>
                    </button>

                    <div
                        className="max-w-4xl max-h-[80vh] w-full aspect-square bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${currentImage}')` }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Thumbnails in lightbox */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i); }}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${img.imageUrl}')` }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">{t.writeReview}</h3>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={reviewForm.userName}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rating *
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <span className={`material-symbols-outlined text-3xl ${star <= reviewForm.rating ? 'text-yellow-400 filled' : 'text-gray-300'}`}>
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewForm.text}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submittingReview ? (
                                        <>
                                            <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">send</span>
                                            Submit Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
