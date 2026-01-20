-- Quick Fix: Sync Primary Images to Products Table
-- Run this in Supabase SQL Editor to fix the image mismatch

-- Update all products.image to match the primary image from product_images
UPDATE products p
SET 
    image = pi.image_url,
    updated_at = NOW()
FROM product_images pi
WHERE pi.product_id = p.id 
  AND pi.is_primary = true;

-- Verify the fix
SELECT 
    p.id,
    p.name,
    p.image as current_product_image,
    pi.image_url as primary_image_url,
    pi.is_primary
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
ORDER BY p.name;
