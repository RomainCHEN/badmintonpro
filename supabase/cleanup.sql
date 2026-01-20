-- ===========================================
-- COMPLETE CLEANUP SCRIPT
-- Run this FIRST before running schema.sql
-- This removes ALL old objects that might cause conflicts
-- ===========================================

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ===========================================
-- DROP ALL EXISTING RLS POLICIES
-- ===========================================

-- Products policies
DROP POLICY IF EXISTS "Products are publicly readable" ON products;

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- Orders policies
DROP POLICY IF EXISTS "Orders are publicly readable" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Anonymous can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
DROP POLICY IF EXISTS "Anonymous can create orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;

-- Order items policies
DROP POLICY IF EXISTS "Order items are publicly readable" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Anonymous can view order items" ON order_items;

-- Wishlists policies
DROP POLICY IF EXISTS "Wishlists are readable" ON wishlists;
DROP POLICY IF EXISTS "Anyone can modify wishlists" ON wishlists;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can delete from own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;

-- Carts policies
DROP POLICY IF EXISTS "Carts are readable" ON carts;
DROP POLICY IF EXISTS "Anyone can modify carts" ON carts;
DROP POLICY IF EXISTS "Users can view own cart" ON carts;
DROP POLICY IF EXISTS "Users can add to own cart" ON carts;
DROP POLICY IF EXISTS "Users can update own cart" ON carts;
DROP POLICY IF EXISTS "Users can delete from own cart" ON carts;
DROP POLICY IF EXISTS "Users can manage own cart" ON carts;

-- ===========================================
-- DONE! Now run schema.sql
-- ===========================================
