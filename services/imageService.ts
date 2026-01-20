import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ProductImage } from '../types';

// Convert database row to ProductImage type
const mapDbToProductImage = (row: any): ProductImage => ({
    id: row.id,
    productId: row.product_id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    displayOrder: row.display_order,
    isPrimary: row.is_primary,
});

// Demo images for fallback
const getDemoImages = (productId: string, primaryImage: string): ProductImage[] => [
    {
        id: crypto.randomUUID(),
        productId,
        imageUrl: primaryImage,
        altText: 'Main product image',
        displayOrder: 0,
        isPrimary: true,
    },
    {
        id: crypto.randomUUID(),
        productId,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZSZ0gX0wOrXgF3J5HV4-xyQXzYPmQCAHlPGZPoifjFCwSWKYNSglAecgzfcAecRJItmysGapX3okuYVEiNuPFD4wySBvYkxdnmbFcTCADMlfgGrrg14RV1XC5l6-wsf8lZg3e8qVTZcZuDXWKaxwjzvrZZ12ucoMpCZex6dUbf2yoOoBWjCb4GuoSMK0O06Fa_asAnboAp84L4J0hjPqwemSBEQN7RQ15Qa6CTywCnoHxKw-W5UDDTkc48hsGObu2DPiDslj5zA',
        altText: 'Detail view 1',
        displayOrder: 1,
        isPrimary: false,
    },
    {
        id: crypto.randomUUID(),
        productId,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-AIDj3OG-K5SbxBLFx9iknigEcno2c0vkg4zSepYzKxvbxE5JV8cavBEXCVCxywD7kVqfC6OUjzgvJgCgHjubJHdIS6DwjunHlPObG5phtgK03WHEaFo-aPCD3mZXqpfxYeOb_RAen1hKMNMCo3y-4P-vBNxAC_-rT8aXlmtojro4zyGDxRdwDxUm0990tDPtXxXy0sTOClWKohzyaWZJWdIWNhdORwdsN1_G2kkIz-61vnxrbjYwJxfMmQNE-vSjk0x8FQC7_w',
        altText: 'Detail view 2',
        displayOrder: 2,
        isPrimary: false,
    },
];

// Get all images for a product
export const getProductImages = async (productId: string, primaryImage?: string): Promise<ProductImage[]> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Using demo images - Supabase not configured');
        return getDemoImages(productId, primaryImage || '');
    }

    try {
        const { data, error } = await supabase!
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });

        if (error) throw error;

        // If no images in database, return demo images
        if (!data || data.length === 0) {
            console.log('[ImageService] No images found, using demo images');
            return getDemoImages(productId, primaryImage || '');
        }

        return data.map(mapDbToProductImage);
    } catch (error) {
        console.error('[ImageService] Error fetching images:', error);
        return getDemoImages(productId, primaryImage || '');
    }
};

// Add image to a product (URL-based)
export const addProductImage = async (
    productId: string,
    imageUrl: string,
    altText?: string,
    isPrimary: boolean = false
): Promise<ProductImage | null> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Demo mode - simulating image add');
        return {
            id: crypto.randomUUID(),
            productId,
            imageUrl,
            altText,
            displayOrder: 0,
            isPrimary,
        };
    }

    try {
        // Get current max display order
        const { data: existingImages } = await supabase!
            .from('product_images')
            .select('display_order')
            .eq('product_id', productId)
            .order('display_order', { ascending: false })
            .limit(1);

        const nextOrder = existingImages && existingImages.length > 0
            ? existingImages[0].display_order + 1
            : 0;

        // If setting as primary, unset other primaries first
        if (isPrimary) {
            await supabase!
                .from('product_images')
                .update({ is_primary: false })
                .eq('product_id', productId);
        }

        const { data, error } = await supabase!
            .from('product_images')
            .insert({
                product_id: productId,
                image_url: imageUrl,
                alt_text: altText,
                display_order: nextOrder,
                is_primary: isPrimary,
            })
            .select()
            .single();

        if (error) throw error;
        return data ? mapDbToProductImage(data) : null;
    } catch (error) {
        console.error('[ImageService] Error adding image:', error);
        return null;
    }
};

// Delete an image
export const deleteProductImage = async (imageId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Demo mode - simulating image delete');
        return true;
    }

    try {
        const { error } = await supabase!
            .from('product_images')
            .delete()
            .eq('id', imageId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[ImageService] Error deleting image:', error);
        return false;
    }
};

// Set an image as primary and sync to products table
export const setPrimaryImage = async (productId: string, imageId: string, imageUrl?: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Demo mode - simulating set primary');
        return true;
    }

    try {
        // Unset all other primaries for this product
        await supabase!
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId);

        // Set the selected image as primary
        const { error } = await supabase!
            .from('product_images')
            .update({ is_primary: true })
            .eq('id', imageId);

        if (error) throw error;

        // Also update the product's main image field to keep in sync
        if (imageUrl) {
            await supabase!
                .from('products')
                .update({ image: imageUrl, updated_at: new Date().toISOString() })
                .eq('id', productId);
        }

        return true;
    } catch (error) {
        console.error('[ImageService] Error setting primary image:', error);
        return false;
    }
};

// Reorder images
export const reorderImages = async (productId: string, imageIds: string[]): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Demo mode - simulating reorder');
        return true;
    }

    try {
        // Update each image with new display order
        const updates = imageIds.map((id, index) =>
            supabase!
                .from('product_images')
                .update({ display_order: index })
                .eq('id', id)
        );

        await Promise.all(updates);
        return true;
    } catch (error) {
        console.error('[ImageService] Error reordering images:', error);
        return false;
    }
};

// Update image details
export const updateProductImage = async (
    imageId: string,
    updates: { imageUrl?: string; altText?: string }
): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[ImageService] Demo mode - simulating update');
        return true;
    }

    try {
        const updateData: any = {};
        if (updates.imageUrl) updateData.image_url = updates.imageUrl;
        if (updates.altText !== undefined) updateData.alt_text = updates.altText;

        const { error } = await supabase!
            .from('product_images')
            .update(updateData)
            .eq('id', imageId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[ImageService] Error updating image:', error);
        return false;
    }
};
