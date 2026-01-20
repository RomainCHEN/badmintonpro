import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product } from '../types';

export interface CreateProductInput {
    name: string;
    name_cn?: string;
    description?: string;
    description_cn?: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    tags?: string[];
    stock: number;
    sku?: string;
    specs?: {
        weight?: string;
        grip?: string;
        balance?: string;
        flex?: string;
    };
    isNew?: boolean;
    salePercentage?: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}

// Create a new product
export const createProduct = async (input: CreateProductInput): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
        console.log('[AdminService] Demo mode - simulating product creation');
        // Return simulated created product for demo mode
        return {
            id: crypto.randomUUID(),
            name: input.name,
            name_cn: input.name_cn,
            description: input.description,
            description_cn: input.description_cn,
            brand: input.brand,
            price: input.price,
            originalPrice: input.originalPrice,
            rating: 0,
            reviews: 0,
            image: input.image,
            category: input.category,
            tags: input.tags || [],
            stock: input.stock,
            sku: input.sku,
            specs: input.specs,
            isNew: input.isNew,
            salePercentage: input.salePercentage,
        };
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .insert({
                name: input.name,
                name_cn: input.name_cn || null,
                description: input.description || null,
                description_cn: input.description_cn || null,
                brand: input.brand,
                price: input.price,
                original_price: input.originalPrice || null,
                image: input.image,
                category: input.category,
                tags: input.tags || [],
                stock: input.stock,
                sku: input.sku || null,
                specs: input.specs || {},
                is_new: input.isNew || false,
                sale_percentage: input.salePercentage || 0,
                rating: 0,
                reviews_count: 0,
            })
            .select()
            .single();

        if (error) throw error;

        return data ? {
            id: data.id,
            name: data.name,
            name_cn: data.name_cn,
            description: data.description,
            description_cn: data.description_cn,
            brand: data.brand,
            price: parseFloat(data.price),
            originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
            rating: parseFloat(data.rating),
            reviews: data.reviews_count,
            image: data.image,
            category: data.category,
            tags: data.tags,
            stock: data.stock,
            sku: data.sku,
            specs: data.specs,
            isNew: data.is_new,
            salePercentage: data.sale_percentage,
        } : null;
    } catch (error) {
        console.error('[AdminService] Error creating product:', error);
        return null;
    }
};

// Update an existing product
export const updateProduct = async (input: UpdateProductInput): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
        console.log('[AdminService] Demo mode - simulating product update');
        // Return simulated updated product for demo mode
        return {
            id: input.id,
            name: input.name || '',
            name_cn: input.name_cn,
            description: input.description,
            description_cn: input.description_cn,
            brand: input.brand || '',
            price: input.price || 0,
            originalPrice: input.originalPrice,
            rating: 4.5,
            reviews: 0,
            image: input.image || '',
            category: input.category || '',
            tags: input.tags || [],
            stock: input.stock || 0,
            sku: input.sku,
            specs: input.specs,
            isNew: input.isNew,
            salePercentage: input.salePercentage,
        };
    }

    try {
        const updateData: any = { updated_at: new Date().toISOString() };

        if (input.name !== undefined) updateData.name = input.name;
        if (input.name_cn !== undefined) updateData.name_cn = input.name_cn;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.description_cn !== undefined) updateData.description_cn = input.description_cn;
        if (input.brand !== undefined) updateData.brand = input.brand;
        if (input.price !== undefined) updateData.price = input.price;
        if (input.originalPrice !== undefined) updateData.original_price = input.originalPrice;
        if (input.image !== undefined) updateData.image = input.image;
        if (input.category !== undefined) updateData.category = input.category;
        if (input.tags !== undefined) updateData.tags = input.tags;
        if (input.stock !== undefined) updateData.stock = input.stock;
        if (input.sku !== undefined) updateData.sku = input.sku;
        if (input.specs !== undefined) updateData.specs = input.specs;
        if (input.isNew !== undefined) updateData.is_new = input.isNew;
        if (input.salePercentage !== undefined) updateData.sale_percentage = input.salePercentage;

        const { data, error } = await supabase!
            .from('products')
            .update(updateData)
            .eq('id', input.id)
            .select()
            .single();

        if (error) throw error;

        return data ? {
            id: data.id,
            name: data.name,
            name_cn: data.name_cn,
            description: data.description,
            description_cn: data.description_cn,
            brand: data.brand,
            price: parseFloat(data.price),
            originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
            rating: parseFloat(data.rating),
            reviews: data.reviews_count,
            image: data.image,
            category: data.category,
            tags: data.tags,
            stock: data.stock,
            sku: data.sku,
            specs: data.specs,
            isNew: data.is_new,
            salePercentage: data.sale_percentage,
        } : null;
    } catch (error) {
        console.error('[AdminService] Error updating product:', error);
        return null;
    }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.error('[AdminService] Cannot delete product - Supabase not configured');
        return false;
    }

    try {
        const { error } = await supabase!
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[AdminService] Error deleting product:', error);
        return false;
    }
};

// Update product stock
export const updateStock = async (id: string, stock: number): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.error('[AdminService] Cannot update stock - Supabase not configured');
        return false;
    }

    try {
        const { error } = await supabase!
            .from('products')
            .update({ stock, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[AdminService] Error updating stock:', error);
        return false;
    }
};

// Get low stock products
export const getLowStockProducts = async (threshold = 10): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        return [];
    }

    try {
        const { data, error } = await supabase!
            .from('products')
            .select('*')
            .lte('stock', threshold)
            .order('stock', { ascending: true });

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            brand: row.brand,
            price: parseFloat(row.price),
            originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
            rating: parseFloat(row.rating),
            reviews: row.reviews_count,
            image: row.image,
            category: row.category,
            tags: row.tags,
            stock: row.stock,
            sku: row.sku,
            specs: row.specs,
            isNew: row.is_new,
            salePercentage: row.sale_percentage,
        }));
    } catch (error) {
        console.error('[AdminService] Error fetching low stock products:', error);
        return [];
    }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[AdminService] Demo mode - simulating order status update');
        return true; // Simulate success in demo mode
    }

    try {
        const { error } = await supabase!
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[AdminService] Error updating order status:', error);
        return false;
    }
};
