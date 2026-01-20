import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CartItem, Product } from '../types';

export interface DbCartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

// Get user's cart from database
export const getCart = async (userId: string): Promise<CartItem[]> => {
    if (!isSupabaseConfigured()) {
        // Return from localStorage for demo mode
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    }

    try {
        const { data, error } = await supabase!
            .from('carts')
            .select(`
        id,
        product_id,
        quantity,
        created_at,
        products (*)
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching cart:', error);
            return [];
        }

        // Transform to CartItem format
        return data?.map((item: any) => ({
            ...item.products,
            quantity: item.quantity,
        })).filter(Boolean) || [];
    } catch (err) {
        console.error('Error fetching cart:', err);
        return [];
    }
};

// Add item to cart
export const addToCart = async (
    userId: string,
    productId: string,
    quantity: number = 1
): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true; // Demo mode uses local state
    }

    try {
        // Check if item already exists
        const { data: existing } = await supabase!
            .from('carts')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existing) {
            // Update quantity
            const { error } = await supabase!
                .from('carts')
                .update({
                    quantity: existing.quantity + quantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            // Insert new item
            const { error } = await supabase!
                .from('carts')
                .insert({
                    user_id: userId,
                    product_id: productId,
                    quantity,
                });

            if (error) throw error;
        }

        return true;
    } catch (err) {
        console.error('Error adding to cart:', err);
        return false;
    }
};

// Update cart item quantity
export const updateCartQuantity = async (
    userId: string,
    productId: string,
    quantity: number
): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        if (quantity <= 0) {
            return removeFromCart(userId, productId);
        }

        const { error } = await supabase!
            .from('carts')
            .update({
                quantity,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Error updating cart:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error updating cart:', err);
        return false;
    }
};

// Remove item from cart
export const removeFromCart = async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        const { error } = await supabase!
            .from('carts')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from cart:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error removing from cart:', err);
        return false;
    }
};

// Clear entire cart
export const clearCart = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        const { error } = await supabase!
            .from('carts')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error clearing cart:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error clearing cart:', err);
        return false;
    }
};

// Sync local cart to database (for when user logs in)
export const syncCartToDatabase = async (userId: string, localCart: CartItem[]): Promise<void> => {
    if (!isSupabaseConfigured() || localCart.length === 0) return;

    try {
        // Get existing cart items
        const { data: existingItems } = await supabase!
            .from('carts')
            .select('product_id, quantity')
            .eq('user_id', userId);

        const existingMap = new Map(
            existingItems?.map((item: any) => [item.product_id, item.quantity]) || []
        );

        // Merge local cart with database cart (add quantities)
        const mergedItems = localCart.map(item => ({
            user_id: userId,
            product_id: item.id,
            quantity: item.quantity + (existingMap.get(item.id) || 0),
        }));

        // Upsert merged items
        for (const item of mergedItems) {
            await supabase!
                .from('carts')
                .upsert(item, { onConflict: 'user_id,product_id' });
        }

        // Clear local storage after sync
        localStorage.removeItem('cart');
    } catch (err) {
        console.error('Error syncing cart:', err);
    }
};

// Get cart item count
export const getCartCount = async (userId: string): Promise<number> => {
    if (!isSupabaseConfigured()) {
        const stored = localStorage.getItem('cart');
        const cart: CartItem[] = stored ? JSON.parse(stored) : [];
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    try {
        const { data, error } = await supabase!
            .from('carts')
            .select('quantity')
            .eq('user_id', userId);

        if (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }

        return data?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
    } catch (err) {
        console.error('Error getting cart count:', err);
        return 0;
    }
};
