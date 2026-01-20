import React, { useState, useEffect } from 'react';
import { getAllReviews, deleteReview } from '../services/reviewService';

interface Review {
    id: string;
    productId: string;
    productName?: string;
    user: string;
    avatarColor: string;
    verified: boolean;
    rating: number;
    text: string;
    date: string;
}

const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('All');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await getAllReviews();
            // Map the returned data to our Review interface
            setReviews(data.map(r => ({
                id: r.id,
                productId: r.productId,
                productName: r.productName,
                user: r.user,
                avatarColor: r.avatarColor,
                verified: r.verified,
                rating: r.rating,
                text: r.text,
                date: r.date,
            })));
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleDelete = async (id: string, productId: string) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setDeletingId(id);
            const success = await deleteReview(id, productId);
            if (success) {
                setReviews(prev => prev.filter(r => r.id !== id));
            } else {
                alert('Failed to delete review');
            }
            setDeletingId(null);
        }
    };

    const filteredReviews = filter === 'All'
        ? reviews
        : filter === 'Verified'
            ? reviews.filter(r => r.verified)
            : filter === 'Unverified'
                ? reviews.filter(r => !r.verified)
                : reviews.filter(r => Math.floor(r.rating) === parseInt(filter));

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Review Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Moderate and manage customer reviews</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <p className="text-sm text-slate-500">Total Reviews</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{reviews.length}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <p className="text-sm text-slate-500">Average Rating</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)} ★</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <p className="text-sm text-slate-500">Verified</p>
                    <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.verified).length}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <p className="text-sm text-slate-500">Unverified</p>
                    <p className="text-2xl font-bold text-yellow-600">{reviews.filter(r => !r.verified).length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Verified', 'Unverified', '5', '4', '3', '2', '1'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {['5', '4', '3', '2', '1'].includes(f) ? `${f} ★` : f}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-sm text-slate-500">
                    {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="animate-spin material-symbols-outlined text-3xl text-primary">progress_activity</span>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">reviews</span>
                        <p className="text-slate-500">No reviews found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredReviews.map(review => (
                            <div key={review.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center font-bold text-sm`}>
                                            {review.user.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-slate-900 dark:text-white">{review.user}</span>
                                                {review.verified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                        <span className="material-symbols-outlined text-xs">verified</span>
                                                        Verified
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500">• {review.date}</span>
                                            </div>
                                            <p className="text-sm text-primary font-medium mt-1">
                                                {review.productName}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        className={`material-symbols-outlined text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-slate-300'
                                                            }`}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                                <span className="text-sm text-slate-500 ml-1">{review.rating}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{review.text}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(review.id, review.productId)}
                                            disabled={deletingId === review.id}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete Review"
                                        >
                                            <span className="material-symbols-outlined text-lg">{deletingId === review.id ? 'progress_activity' : 'delete'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
