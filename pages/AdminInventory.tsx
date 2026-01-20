import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { deleteProduct, updateStock, createProduct, updateProduct } from '../services/adminService';
import { Product, ProductImage } from '../types';
import AdminImageManager from '../components/AdminImageManager';

interface ProductFormData {
    name: string;
    name_cn: string;
    brand: string;
    price: string;
    originalPrice: string;
    category: string;
    stock: string;
    sku: string;
    image: string;
    description: string;
    description_cn: string;
    isNew: boolean;
    salePercentage: string;
    tags: string[];
    specs: {
        weight: string;
        balance: string;
        flex: string;
        grip: string;
    };
}

const defaultFormData: ProductFormData = {
    name: '',
    name_cn: '',
    brand: 'Yonex',
    price: '',
    originalPrice: '',
    category: 'Rackets',
    stock: '',
    sku: '',
    image: '',
    description: '',
    description_cn: '',
    isNew: false,
    salePercentage: '',
    tags: [],
    specs: {
        weight: '',
        balance: '',
        flex: '',
        grip: '',
    },
};

const AdminInventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const success = await deleteProduct(id);
            if (success) {
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product. Make sure Supabase is configured.');
            }
        }
    };

    const handleStockUpdate = async (id: string, newStock: number) => {
        const success = await updateStock(id, newStock);
        if (success) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(defaultFormData);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            name_cn: product.name_cn || '',
            brand: product.brand,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category,
            stock: product.stock.toString(),
            sku: product.sku || '',
            image: product.image,
            description: product.description || '',
            description_cn: product.description_cn || '',
            isNew: product.isNew || false,
            salePercentage: product.salePercentage?.toString() || '',
            tags: product.tags || [],
            specs: {
                weight: product.specs?.weight || '',
                balance: product.specs?.balance || '',
                flex: product.specs?.flex || '',
                grip: product.specs?.grip || '',
            },
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData(defaultFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const productData = {
            name: formData.name,
            name_cn: formData.name_cn || undefined,
            description: formData.description || undefined,
            description_cn: formData.description_cn || undefined,
            brand: formData.brand,
            price: parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
            category: formData.category,
            stock: parseInt(formData.stock),
            sku: formData.sku || undefined,
            image: formData.image || 'https://via.placeholder.com/400x400?text=Product',
            isNew: formData.isNew,
            salePercentage: formData.salePercentage ? parseInt(formData.salePercentage) : undefined,
            tags: formData.tags,
            specs: {
                weight: formData.specs.weight || undefined,
                balance: formData.specs.balance || undefined,
                flex: formData.specs.flex || undefined,
                grip: formData.specs.grip || undefined,
            },
        };

        if (editingProduct) {
            // Update existing product
            const updated = await updateProduct({ id: editingProduct.id, ...productData });
            if (updated) {
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
                closeModal();
            } else {
                alert('Failed to update product. Make sure Supabase is configured.');
            }
        } else {
            // Create new product
            const newProduct = await createProduct(productData);
            if (newProduct) {
                setProducts(prev => [newProduct, ...prev]);
                closeModal();
            } else {
                alert('Failed to create product. Make sure Supabase is configured.');
            }
        }
        setSaving(false);
    };

    const toggleTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Page Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Product Inventory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your catalog, update stock levels, and organize products.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Filters & Toolbar */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filters
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium">All Products</button>
                    {['Active', 'Draft', 'Low Stock'].map(t => (
                        <button key={t} className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium transition-colors">{t}</button>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                    <select className="bg-transparent border-none text-sm font-medium text-slate-900 dark:text-white focus:ring-0 cursor-pointer py-1 pl-2 pr-8">
                        <option>Date Added</option>
                        <option>Price: High to Low</option>
                        <option>Price: Low to High</option>
                        <option>Stock Level</option>
                    </select>
                </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="animate-spin material-symbols-outlined text-3xl text-primary">progress_activity</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 size-4" />
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stock Level</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {products.map(product => {
                                    const stockPercentage = Math.min(100, Math.max(0, (product.stock / 50) * 100));
                                    const stockColor = product.stock < 10 ? 'bg-red-500' : (product.stock < 20 ? 'bg-yellow-500' : 'bg-green-500');
                                    const stockBg = product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300';

                                    let statusBadge = (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                                            <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                                            Active
                                        </span>
                                    );
                                    if (product.stock < 10) {
                                        statusBadge = (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                                                <span className="size-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
                                                Low Stock
                                            </span>
                                        );
                                    }

                                    const colors = ['bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'];
                                    const catColor = colors[product.category.length % colors.length];

                                    return (
                                        <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 size-4" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${product.image}')` }}></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={product.stock}
                                                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                                                        className={`text-sm font-medium ${stockBg} w-12 bg-transparent border-none p-0 focus:ring-0 text-center`}
                                                    />
                                                    <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div className={`h-full ${stockColor}`} style={{ width: `${stockPercentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-slate-500 line-through">${product.originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {statusBadge}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{products.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{products.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {editingProduct ? 'Update product information' : 'Fill in the product details below'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">info</span>
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name (EN) *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="e.g. Astrox 99 Pro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">产品名称 (中文)</label>
                                        <input
                                            type="text"
                                            value={formData.name_cn}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name_cn: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="例如：天斧99 Pro"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (EN)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary resize-none"
                                        rows={2}
                                        placeholder="Product description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">产品描述 (中文)</label>
                                    <textarea
                                        value={formData.description_cn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description_cn: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary resize-none"
                                        rows={2}
                                        placeholder="中文产品描述..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand *</label>
                                        <select
                                            value={formData.brand}
                                            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                        >
                                            <option>Yonex</option>
                                            <option>Victor</option>
                                            <option>Li-Ning</option>
                                            <option>Generic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                        >
                                            <option>Rackets</option>
                                            <option>Footwear</option>
                                            <option>Apparel</option>
                                            <option>Accessories</option>
                                        </select>
                                    </div>
                                </div>
                            </div>


                            {/* Pricing */}
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">payments</span>
                                    Pricing & Stock
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="199.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="249.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sale %</label>
                                        <input
                                            type="number"
                                            value={formData.salePercentage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, salePercentage: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock *</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                        placeholder="YNX-AST99-PRO"
                                    />
                                </div>
                            </div>

                            {/* Image Management */}
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">collections</span>
                                    Product Images
                                </h3>

                                {editingProduct ? (
                                    /* Full image manager for existing products */
                                    <AdminImageManager
                                        productId={editingProduct.id}
                                        primaryImage={editingProduct.image}
                                        onImagesChange={(images: ProductImage[]) => {
                                            // Update primary image URL if changed
                                            const primary = images.find(img => img.isPrimary);
                                            if (primary) {
                                                setFormData(prev => ({ ...prev, image: primary.imageUrl }));
                                            }
                                        }}
                                    />
                                ) : (
                                    /* Simple URL input for new products */
                                    <div className="space-y-3">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Add a primary image for the new product. You can add more images after creating the product.
                                        </p>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Image URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.image}
                                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        {formData.image && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${formData.image}')` }}></div>
                                                <span className="text-sm text-slate-500">Image Preview</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">sell</span>
                                    Tags & Labels
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['New', 'Sale', 'Best Seller', 'Featured'].map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag)
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isNew"
                                        checked={formData.isNew}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isNew" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as New Arrival</label>
                                </div>
                            </div>

                            {/* Specifications (for Rackets) */}
                            {formData.category === 'Rackets' && (
                                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">tune</span>
                                        Specifications
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight</label>
                                            <select
                                                value={formData.specs.weight}
                                                onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, weight: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select...</option>
                                                <option>2U (90-94g)</option>
                                                <option>3U (85-89g)</option>
                                                <option>4U (80-84g)</option>
                                                <option>5U (75-79g)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Balance</label>
                                            <select
                                                value={formData.specs.balance}
                                                onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, balance: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select...</option>
                                                <option>Head Heavy</option>
                                                <option>Even Balance</option>
                                                <option>Head Light</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Flex</label>
                                            <select
                                                value={formData.specs.flex}
                                                onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, flex: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select...</option>
                                                <option>Extra Stiff</option>
                                                <option>Stiff</option>
                                                <option>Medium</option>
                                                <option>Flexible</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grip Size</label>
                                            <select
                                                value={formData.specs.grip}
                                                onChange={(e) => setFormData(prev => ({ ...prev, specs: { ...prev.specs, grip: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select...</option>
                                                <option>G4 (Small)</option>
                                                <option>G5 (Medium)</option>
                                                <option>G6 (Large)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">{editingProduct ? 'save' : 'add'}</span>
                                            {editingProduct ? 'Save Changes' : 'Add Product'}
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

export default AdminInventory;
