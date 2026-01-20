import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Review } from '../types';
import { REVIEWS, PRODUCT_REVIEWS } from '../constants';

// Avatar color options
const AVATAR_COLORS = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
    'bg-primary/20 text-primary',
];

// Convert database row to Review type
const mapDbReviewToReview = (row: any): Review => ({
    id: row.id,
    user: row.user_name,
    avatarColor: row.avatar_color,
    verified: row.verified,
    date: formatRelativeDate(new Date(row.created_at)),
    rating: parseFloat(row.rating),
    text: row.text,
});

// Format date as relative string
const formatRelativeDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
};

// Get reviews for a product
export const getReviewsByProductId = async (productId: string): Promise<Review[]> => {
    // Get product-specific mock reviews
    let mockReviews = PRODUCT_REVIEWS[productId] || [];

    // Generate fallback reviews if none exist for this product
    if (mockReviews.length === 0) {
        mockReviews = generateFallbackReviews(productId);
    }

    if (!isSupabaseConfigured()) {
        console.log('[ReviewService] Using mock data - Supabase not configured');
        return deduplicateReviews(mockReviews);
    }

    try {
        const { data, error } = await supabase!
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Return product-specific mock data if no reviews found in database
        if (!data || data.length === 0) {
            return deduplicateReviews(mockReviews);
        }

        // Deduplicate database reviews (in case of duplicate inserts)
        const reviews = data.map(mapDbReviewToReview);
        return deduplicateReviews(reviews);
    } catch (error) {
        console.error('[ReviewService] Error fetching reviews:', error);
        return deduplicateReviews(mockReviews); // Fallback to product-specific mock data
    }
};

// Remove duplicate reviews based on user name and text content
const deduplicateReviews = (reviews: Review[]): Review[] => {
    const seen = new Set<string>();
    return reviews.filter(review => {
        // Create a unique key from user name and first 50 chars of text
        const key = `${review.user}-${review.text.substring(0, 50)}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

// Generate fallback reviews for products without predefined reviews
const generateFallbackReviews = (productId: string): Review[] => {
    const fallbackAvatarColors = AVATAR_COLORS;

    // Generate 2 mock reviews with realistic ratings (4-5 stars)
    return [
        {
            id: `fallback-${productId}-1`,
            user: 'Happy Customer',
            avatarColor: fallbackAvatarColors[Math.floor(Math.random() * fallbackAvatarColors.length)],
            verified: true,
            date: '1 week ago',
            rating: 5,
            text: 'Great product! Exactly what I was looking for. Fast shipping and excellent quality. Would definitely recommend to other badminton players.',
        },
        {
            id: `fallback-${productId}-2`,
            user: 'Badminton Fan',
            avatarColor: fallbackAvatarColors[Math.floor(Math.random() * fallbackAvatarColors.length)],
            verified: true,
            date: '2 weeks ago',
            rating: 4,
            text: 'Good value for money. The product meets my expectations. BadmintonPro has a nice selection and customer service was helpful.',
        },
    ];
};

// Create a new review
export const createReview = async (
    productId: string,
    review: {
        userName: string;
        rating: number;
        text: string;
    }
): Promise<Review | null> => {
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    // Demo mode - return simulated review
    if (!isSupabaseConfigured()) {
        console.log('[ReviewService] Demo mode - simulating review creation');
        return {
            id: crypto.randomUUID(),
            user: review.userName,
            avatarColor,
            verified: false,
            date: 'Today',
            rating: review.rating,
            text: review.text,
        };
    }

    try {
        const { data, error } = await supabase!
            .from('reviews')
            .insert({
                product_id: productId,
                user_name: review.userName,
                rating: review.rating,
                text: review.text,
                verified: false,
                avatar_color: avatarColor,
            })
            .select()
            .single();

        if (error) throw error;

        // Update product review count and average rating
        await updateProductReviewStats(productId);

        return data ? mapDbReviewToReview(data) : null;
    } catch (error) {
        console.error('[ReviewService] Error creating review:', error);
        return null;
    }
};

// Delete a review
export const deleteReview = async (reviewId: string, productId?: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        console.log('[ReviewService] Demo mode - simulating review deletion');
        return true;
    }

    try {
        const { error } = await supabase!
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;

        // Update product review count if productId provided
        if (productId) {
            await updateProductReviewStats(productId);
        }

        return true;
    } catch (error) {
        console.error('[ReviewService] Error deleting review:', error);
        return false;
    }
};

// Update product review statistics (count and average rating)
export const updateProductReviewStats = async (productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return true;
    }

    try {
        // Get all reviews for the product
        const { data: reviews, error: fetchError } = await supabase!
            .from('reviews')
            .select('rating')
            .eq('product_id', productId);

        if (fetchError) throw fetchError;

        const reviewCount = reviews?.length || 0;
        const avgRating = reviewCount > 0
            ? reviews!.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviewCount
            : 0;

        // Update the product
        const { error: updateError } = await supabase!
            .from('products')
            .update({
                reviews_count: reviewCount,
                rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
            })
            .eq('id', productId);

        if (updateError) throw updateError;

        return true;
    } catch (error) {
        console.error('[ReviewService] Error updating review stats:', error);
        return false;
    }
};

// Get all reviews (for admin)
export const getAllReviews = async (): Promise<(Review & { productId: string; productName?: string })[]> => {
    if (!isSupabaseConfigured()) {
        console.log('[ReviewService] Using mock data for admin - Supabase not configured');
        return REVIEWS.map(r => ({ ...r, productId: '11111111-1111-1111-1111-111111111111' }));
    }

    try {
        const { data, error } = await supabase!
            .from('reviews')
            .select(`
                *,
                products (name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(row => ({
            ...mapDbReviewToReview(row),
            productId: row.product_id,
            productName: row.products?.name,
        }));
    } catch (error) {
        console.error('[ReviewService] Error fetching all reviews:', error);
        return REVIEWS.map(r => ({ ...r, productId: '11111111-1111-1111-1111-111111111111' }));
    }
};
