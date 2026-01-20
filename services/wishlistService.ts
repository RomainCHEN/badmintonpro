import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product } from '../types';

export interface WishlistItem {
    id: string;
    product_id: string;
    product?: Product;
    created_at: string;
}

// Get user's wishlist
export const getWishlist = async (userId: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
        // Return from localStorage for demo mode
        const stored = localStorage.getItem('wishlist');
        return stored ? JSON.parse(stored) : [];
    }

    try {
        const { data, error } = await supabase!
            .from('wishlists')
            .select(`
        id,
        product_id,
        created_at,
        products (*)
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }

        // Extract products from join
        return data?.map((item: any) => item.products).filter(Boolean) || [];
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        return [];
    }
};

// Add item to wishlist
export const addToWishlist = async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        // Demo mode - use localStorage
        return true;
    }

    try {
        const { error } = await supabase!
            .from('wishlists')
            .upsert({
                user_id: userId,
                product_id: productId,
            }, {
                onConflict: 'user_id,product_id'
            });

        if (error) {
            console.error('Error adding to wishlist:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error adding to wishlist:', err);
        return false;
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        const { error } = await supabase!
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from wishlist:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error removing from wishlist:', err);
        return false;
    }
};

// Check if product is in wishlist
export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        const stored = localStorage.getItem('wishlist');
        const wishlist: Product[] = stored ? JSON.parse(stored) : [];
        return wishlist.some(item => item.id === productId);
    }

    try {
        const { data, error } = await supabase!
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error checking wishlist:', error);
            return false;
        }

        return !!data;
    } catch (err) {
        console.error('Error checking wishlist:', err);
        return false;
    }
};

// Sync local wishlist to database (for when user logs in)
export const syncWishlistToDatabase = async (userId: string, localWishlist: Product[]): Promise<void> => {
    if (!isSupabaseConfigured() || localWishlist.length === 0) return;

    try {
        const items = localWishlist.map(product => ({
            user_id: userId,
            product_id: product.id,
        }));

        await supabase!
            .from('wishlists')
            .upsert(items, { onConflict: 'user_id,product_id' });

        // Clear local storage after sync
        localStorage.removeItem('wishlist');
    } catch (err) {
        console.error('Error syncing wishlist:', err);
    }
};
