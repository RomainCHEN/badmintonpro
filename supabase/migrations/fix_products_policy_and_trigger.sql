-- Fix: Add UPDATE policy and Auto-Sync Trigger
-- Run this in Supabase SQL Editor

-- ===========================================
-- 1. ADD UPDATE POLICY FOR PRODUCTS TABLE
-- ===========================================
-- Allow all operations on products (for admin functionality)
CREATE POLICY "Allow update on products" ON products
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow insert on products" ON products
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow delete on products" ON products
    FOR DELETE TO anon, authenticated
    USING (true);

-- ===========================================
-- 2. CREATE AUTO-SYNC TRIGGER
-- ===========================================
-- This trigger automatically syncs the primary image to products.image
-- whenever a new primary image is set in product_images

CREATE OR REPLACE FUNCTION sync_primary_image_to_product()
RETURNS TRIGGER AS $$
BEGIN
    -- When an image is set as primary, update the products table
    IF NEW.is_primary = true THEN
        UPDATE products 
        SET image = NEW.image_url, updated_at = NOW()
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_sync_primary_image ON product_images;

-- Create the trigger
CREATE TRIGGER trigger_sync_primary_image
    AFTER INSERT OR UPDATE OF is_primary ON product_images
    FOR EACH ROW
    WHEN (NEW.is_primary = true)
    EXECUTE FUNCTION sync_primary_image_to_product();

-- ===========================================
-- 3. SYNC EXISTING PRIMARY IMAGES (One-time fix)
-- ===========================================
UPDATE products p
SET 
    image = pi.image_url,
    updated_at = NOW()
FROM product_images pi
WHERE pi.product_id = p.id 
  AND pi.is_primary = true;

-- ===========================================
-- 4. VERIFY
-- ===========================================
SELECT 
    p.name,
    p.image as products_image,
    pi.image_url as primary_image,
    CASE WHEN p.image = pi.image_url THEN '✓ Synced' ELSE '✗ Not Synced' END as status
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
ORDER BY p.name;
