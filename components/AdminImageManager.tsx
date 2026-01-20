import React, { useState, useEffect } from 'react';
import { ProductImage } from '../types';
import {
    getProductImages,
    addProductImage,
    deleteProductImage,
    setPrimaryImage,
    reorderImages
} from '../services/imageService';

interface AdminImageManagerProps {
    productId: string;
    primaryImage?: string;
    onImagesChange?: (images: ProductImage[]) => void;
}

const AdminImageManager: React.FC<AdminImageManagerProps> = ({
    productId,
    primaryImage,
    onImagesChange
}) => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageAlt, setNewImageAlt] = useState('');
    const [adding, setAdding] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        loadImages();
    }, [productId]);

    const loadImages = async () => {
        setLoading(true);
        const loadedImages = await getProductImages(productId, primaryImage);
        setImages(loadedImages);
        onImagesChange?.(loadedImages);
        setLoading(false);
    };

    const handleAddImage = async () => {
        if (!newImageUrl.trim()) return;

        setAdding(true);
        const isFirst = images.length === 0;
        const newImage = await addProductImage(productId, newImageUrl.trim(), newImageAlt.trim() || undefined, isFirst);

        if (newImage) {
            const updatedImages = [...images, newImage];
            setImages(updatedImages);
            onImagesChange?.(updatedImages);
            setNewImageUrl('');
            setNewImageAlt('');
        }
        setAdding(false);
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const success = await deleteProductImage(imageId);
        if (success) {
            const updatedImages = images.filter(img => img.id !== imageId);
            setImages(updatedImages);
            onImagesChange?.(updatedImages);
        }
    };

    const handleSetPrimary = async (imageId: string) => {
        const image = images.find(img => img.id === imageId);
        if (!image) return;

        const success = await setPrimaryImage(productId, imageId, image.imageUrl);
        if (success) {
            const updatedImages = images.map(img => ({
                ...img,
                isPrimary: img.id === imageId
            }));
            setImages(updatedImages);
            onImagesChange?.(updatedImages);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImages(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        if (draggedIndex !== null) {
            const imageIds = images.map(img => img.id);
            await reorderImages(productId, imageIds);
            onImagesChange?.(images);
        }
        setDraggedIndex(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <span className="animate-spin material-symbols-outlined text-2xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${image.isPrimary
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center bg-slate-100 dark:bg-slate-800"
                            style={{ backgroundImage: `url('${image.imageUrl}')` }}
                        />

                        {/* Primary badge */}
                        {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                Primary
                            </div>
                        )}

                        {/* Actions overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!image.isPrimary && (
                                <button
                                    onClick={() => handleSetPrimary(image.id)}
                                    className="p-2 bg-white rounded-full text-slate-700 hover:bg-primary hover:text-white transition-colors"
                                    title="Set as primary"
                                >
                                    <span className="material-symbols-outlined text-lg">star</span>
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete image"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>

                        {/* Drag handle indicator */}
                        <div className="absolute bottom-2 right-2 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-sm">drag_indicator</span>
                        </div>
                    </div>
                ))}

                {/* Add Image Card */}
                <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                    <span className="text-xs font-medium">Add Image</span>
                </div>
            </div>

            {/* Add Image Form */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">link</span>
                    Add Image by URL
                </h4>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="md:w-40">
                        <input
                            type="text"
                            value={newImageAlt}
                            onChange={(e) => setNewImageAlt(e.target.value)}
                            placeholder="Alt text (optional)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <button
                        onClick={handleAddImage}
                        disabled={!newImageUrl.trim() || adding}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                    >
                        {adding ? (
                            <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add
                            </>
                        )}
                    </button>
                </div>

                {/* URL Preview */}
                {newImageUrl && (
                    <div className="flex items-center gap-3 mt-2">
                        <div
                            className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                            style={{ backgroundImage: `url('${newImageUrl}')` }}
                        />
                        <span className="text-xs text-slate-500">Preview</span>
                    </div>
                )}
            </div>

            {/* Info text */}
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                Drag images to reorder. The primary image is shown on product cards.
            </p>
        </div>
    );
};

export default AdminImageManager;
