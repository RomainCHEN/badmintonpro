import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

// Convert database row to Product type
const mapDbProductToProduct = (row: any): Product => ({
    id: row.id,
    name: row.name,
    name_cn: row.name_cn || undefined,
    description: row.description || undefined,
    description_cn: row.description_cn || undefined,
    brand: row.brand,
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
    rating: parseFloat(row.rating),
    reviews: row.reviews_count,
    image: row.image,
    category: row.category,
    tags: row.tags || [],
    stock: row.stock,
    sku: row.sku || undefined,
    specs: row.specs || undefined,
    isNew: row.is_new,
    salePercentage: row.sale_percentage || undefined,
});

// Get all products
export const getProducts = async (): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        console.log('[ProductService] Using mock data - Supabase not configured');
        return PRODUCTS;
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(mapDbProductToProduct);
    } catch (error) {
        console.error('[ProductService] Error fetching products:', error);
        return PRODUCTS; // Fallback to mock data
    }
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
        return PRODUCTS.find(p => p.id === id) || null;
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data ? mapDbProductToProduct(data) : null;
    } catch (error) {
        console.error('[ProductService] Error fetching product:', error);
        return PRODUCTS.find(p => p.id === id) || null;
    }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        return PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .ilike('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(mapDbProductToProduct);
    } catch (error) {
        console.error('[ProductService] Error fetching products by category:', error);
        return PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
};

// Get products on sale
export const getProductsOnSale = async (): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        return PRODUCTS.filter(p => (p.salePercentage || 0) > 0);
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .gt('sale_percentage', 0)
            .order('sale_percentage', { ascending: false });

        if (error) throw error;
        return (data || []).map(mapDbProductToProduct);
    } catch (error) {
        console.error('[ProductService] Error fetching products on sale:', error);
        return PRODUCTS.filter(p => (p.salePercentage || 0) > 0);
    }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        const q = query.toLowerCase();
        return PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
            .order('rating', { ascending: false });

        if (error) throw error;
        return (data || []).map(mapDbProductToProduct);
    } catch (error) {
        console.error('[ProductService] Error searching products:', error);
        const q = query.toLowerCase();
        return PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
    }
};

// Get trending products (top rated with most reviews)
export const getTrendingProducts = async (limit = 4): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        return PRODUCTS.slice(0, limit);
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .order('reviews_count', { ascending: false })
            .order('rating', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return (data || []).map(mapDbProductToProduct);
    } catch (error) {
        console.error('[ProductService] Error fetching trending products:', error);
        return PRODUCTS.slice(0, limit);
    }
};
