-- Migration: Create Product Images Table
-- Run this in your Supabase SQL Editor to enable multi-image support

-- ===========================================
-- PRODUCT IMAGES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Product images are publicly readable" ON product_images
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow insert/update/delete for authenticated users (for admin)
CREATE POLICY "Allow all operations on product_images" ON product_images
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ===========================================
-- MIGRATE EXISTING PRODUCT IMAGES
-- ===========================================
-- Create a primary image record from each product's current image
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 
    id as product_id,
    image as image_url,
    name || ' - Primary Image' as alt_text,
    0 as display_order,
    true as is_primary
FROM products
WHERE image IS NOT NULL AND image != ''
ON CONFLICT DO NOTHING;

-- ===========================================
-- VERIFY THE MIGRATION
-- ===========================================
SELECT 
    p.name as product_name,
    p.image as products_table_image,
    pi.image_url as product_images_table_url,
    pi.is_primary
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
ORDER BY p.name;
