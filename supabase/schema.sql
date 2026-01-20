-- BadmintonPro Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the necessary tables
-- Updated with User Authentication Support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- USER PROFILES TABLE (extends Supabase Auth)
-- NOTE: This table is optional. The auth system works without it.
-- Only create this after configuring Supabase Auth.
-- ===========================================

-- Uncomment the following block ONLY if you have Supabase Auth configured:
/*
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    default_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
*/

-- ===========================================
-- PRODUCTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    sku TEXT,
    specs JSONB DEFAULT '{}',
    is_new BOOLEAN DEFAULT FALSE,
    sale_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster category queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

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

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- ===========================================
-- REVIEWS TABLE (with optional user association)
-- ===========================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID, -- Optional: Links to auth.users when Supabase Auth is configured
    user_name TEXT NOT NULL,
    avatar_color TEXT DEFAULT 'bg-primary/20 text-primary',
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster product review queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- ===========================================
-- ORDERS TABLE (with optional user association)
-- ===========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Optional: Links to auth.users when Supabase Auth is configured
    order_number TEXT UNIQUE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) DEFAULT 15.00,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
    shipping_address JSONB NOT NULL,
    payment_method TEXT DEFAULT 'Credit Card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user order queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ===========================================
-- ORDER ITEMS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster order item queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ===========================================
-- WISHLISTS TABLE (user-specific)
-- NOTE: Requires Supabase Auth to be fully functional
-- ===========================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Links to auth.users when Supabase Auth is configured
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

-- ===========================================
-- CARTS TABLE (user-specific, persistent)
-- NOTE: Requires Supabase Auth to be fully functional
-- ===========================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Links to auth.users when Supabase Auth is configured
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- ===========================================
-- SEED DATA - Initial Products
-- ===========================================
INSERT INTO products (id, name, brand, price, original_price, rating, reviews_count, image, category, tags, stock, sku, specs, is_new, sale_percentage) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Astrox 99 Pro', 'Yonex', 219.00, 245.00, 4.8, 120, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnIHS2PRwUaGt4O-guEsjZ3olKfT4JLtl4rwXCQl1pWHnqN8NCRTm-cunv2kJEVlshfTTFpjvvBBPY_FXEI7k2xGTqfJz2rQgH5M5EHLk-e9Bff29LkS48oLoEsEU5bOzTHormSRDviMViHCjg_AyOkbq2D7EvncBCUF7KCifLPy-Fac-06xKVlzFLhSsyx94podkic-ctPZuSZ-P-0OXtBsKz42wQhFVVa1i1WWhiy_QGD-OBE214W-ZO5Lx4Bxpj2ewTTy1Fyw', 'Rackets', ARRAY['New', 'Sale'], 12, 'YNX-AST99', '{"weight": "4U", "balance": "Head Heavy", "flex": "Stiff", "grip": "G5"}', TRUE, 15),
    ('22222222-2222-2222-2222-222222222222', 'Thruster F Claw', 'Victor', 185.00, 218.00, 4.7, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOrwenQOE3jAbcSOmq9OwcYUR2p4YTPjWHlYs53EPXsz-7QBwg8rVrTIJd-lfr2qYXXrgphCc-iL9OwUQDtzSKvY0OxcI9SeyDymcR1BQKQXZ0bvGSIL2JuCNxfT-pXrHu0M7Dj9a9X4fK9crA6v8aaptL6f7doHWw8d4S2miu81jI-Cybrm7M7l4qtZKfiuNQq9Uo2VYwnymrzdTEWD9LoaFywohTYILNt-_TkTXmgKfbietuKWPa26_so55jBZ0tMV4xgWyTMw', 'Rackets', ARRAY[]::TEXT[], 8, NULL, '{"weight": "3U", "balance": "Head Heavy"}', FALSE, 15),
    ('33333333-3333-3333-3333-333333333333', 'Power Cushion 65 Z', 'Yonex', 145.00, NULL, 4.5, 128, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQw9fWkV_qdyHt9A9EFxrFAPoliEDb2ZlnXnUoINkcEfyD0m_Acg1izCJfuXSpxgrPvCergIc4fPtNAXUPLOyenuF2ueVh560cpENySOVD5YLJszlB3QM93-VBSlmP-_ngeUG0yEaVJaiM9rFx2d45skygaRXyRJ2YL3dqqXrQDpfM1yexsOYQrKqbAsIn2AegOhB5_I7WRHIJ9IT5m8DWxGkAjfpTdssXCnU0Iv4qkSS4WlWqHbM-BdgM2MnPHdGLShe0WnScbg', 'Footwear', ARRAY[]::TEXT[], 25, 'YNX-PC65Z', '{}', FALSE, 0),
    ('44444444-4444-4444-4444-444444444444', 'Aerosensa 50 (Dozen)', 'Yonex', 35.00, NULL, 5.0, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNhrt45WO39D_nmwnYA8qxgkN_Onb-LPTwnRbVCCAzo-_fcFG_Oql8rTjd4H29ACi3JQBKtnEVJTyKR7Ds8nH0um_hs6Z_VQZIMgmD_wNrEXs-JUobR8cdKnZyykOZQqd6yZkb_xWIoVJeUkwucCT-pJ8KiuXVOlrGPHcxT20dkPUL4aN38tCSnKVP0iu3vQmfIa2MGn3io5VChh29PTBb-STrcZYOHwgntC7o-v7sJ43m_P4EsAMy5YYcisXkoWyogm8uCq44Bg', 'Accessories', ARRAY[]::TEXT[], 150, 'YNX-AS50', '{}', FALSE, 0),
    ('55555555-5555-5555-5555-555555555555', 'Aeronaut 9000 Combat', 'Li-Ning', 230.00, NULL, 4.6, 42, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY9ca6Bhe3HzRNxZ3ea1SIBv9eGIIS9Vylhgr4bqm5YmYuzvh5q1obABiit4eiZ1wwHqNUQzpNG_pml7lbOVQKLB6XoXT74y3dD1aHs4Jd97AOFKduAz8Us_LUyzEv2QsQzLEP4kBx2-2D8mHtBEuIy0J3r4APj7Wn_gqny45YQl41igItpKLlMRqDySxiFpdQeYntdF3VcTsbNyu3BG7xcbJMCba49RpIQ93CfW233-x0xPDBNSKxsgA9qC164RdyEmbtRvOHKA', 'Rackets', ARRAY[]::TEXT[], 5, NULL, '{"weight": "3U", "balance": "Head Heavy"}', FALSE, 0),
    ('66666666-6666-6666-6666-666666666666', 'Nanoflare 800 LT', 'Yonex', 195.00, NULL, 4.7, 65, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZM7HCeAvLivHncPlXlvkKbTb4tM1ldmrk_1sb_pO0ZWLcqfIxom7qhYkRh4QWlmhXyh_IrHgd8OBfeXuM3uXtD7V2E8uSd7kwgm-EBZSJM69w5Ry8fOssh24fZAKD7gMTKWclkmiEZ70Lu3MfPQr33M92Vz_cJVpfQZcwTXj7J-KBieCjGJ4X3WEArzmh0F7ymBGi8hQzqWeezsNcOT_Ky8nVJMvH9umWjPcDjBRx4-me6uQvZDnE73SqR241dhyfTP_HhxJ6gw', 'Rackets', ARRAY[]::TEXT[], 10, NULL, '{"weight": "5U", "balance": "Head Light"}', FALSE, 0),
    ('77777777-7777-7777-7777-777777777777', 'Arcsaber 11 Pro', 'Yonex', 205.00, NULL, 4.9, 200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvbgfE-ZJbXXGP3YNGdO1k3K_Lp2uSZmvzQ3otBQRTVthJpDUNK4sTURbN-Yxvv1dhcM1dDAoAHzH_V0TpbzKt7GrEeSiWh-4EkQLPeuFJNqQgviQelqHv2fz5bbQoodaxyWhCej4zKLnwm98pQG6JVEX3gDGeE4LwiE1cTXmD4PkzofkB2xq10xp-RJKbtdYrHCzEkO-y9y79Knu3lFuTDHQeL8BqD3Db_IbNOKkVPbmkAQwbGHqVU4a-MOMLjIwVjYlOvZvr5w', 'Rackets', ARRAY['Best Seller'], 18, NULL, '{"weight": "3U", "balance": "Even Balance"}', FALSE, 0),
    ('88888888-8888-8888-8888-888888888888', 'Auraspeed 90K Metallic', 'Victor', 175.00, NULL, 4.6, 34, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyGBdq7-VqlMR92JlARlEkiXW0XcVmHKEjX8Nu5OE5oRnmaoD499_EfI3_4DAR8TGD4ydqf_4IKz2hx1XVy__QLaqYVJXzMRQ_XIaDOZJGkayaUFaWqnGU9Ua5mWDwMi6aZuPPgdIMgaIQoP0ZzXt8LvgEnxqVE8ja6Jwx0cBRhHvVK7KBWm5akSfdOrRgXQzxV1hzfPH5cRCCzsid05KcE1jdagkAVo7SHCSVbNd_o5O3C1RAYCgyrJSfi7bLXQ5tSbmlvxK9kA', 'Rackets', ARRAY[]::TEXT[], 7, NULL, '{"weight": "4U", "balance": "Head Light"}', FALSE, 0),
    ('99999999-9999-9999-9999-999999999999', 'Li-Ning Ranger VI - Blue', 'Li-Ning', 145.00, NULL, 4.4, 56, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw9kKZV2LtZzw4Ex-yk82w6snuzsGWe96AhqAcOBr4cb-lqJdkh6fEmBTH54nWwroeYFkI27j8klXCaEekm3zJevumVPLS-C1zFh5YNklwbZePg-KFBnCeueo5SewTsz8SjkwW97bkQybYtrIYfAZnNIrYhf-9V6HPREdLIrP1ZyS5zi-CPUSXqifSQkZOnVs0jJamzPu1GX6c5KGKDsyKPeD-BbBiBdm4h7q485gMpYX16xNrhihJtLpteLTJ6_K56s1IkdBarw', 'Footwear', ARRAY[]::TEXT[], 3, 'LIN-RNG6', '{}', FALSE, 0),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Li-Ning Team Jersey', 'Li-Ning', 45.00, NULL, 4.2, 40, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEojS6Wi3N7_an9bSrpHp1KsJR9sPCySfxfVc3cXYm4gRxFlraYRDVPYtGQwgdOEjhsT70Zmait_S89rXP7-vFumMgUinbHPrbChVt1W8cr9yuVAu5oPneemeh8p5keRfcbgKP2li38kQFR8cj59dNxpA4RF2FiCXtYekEzOR7ytitgf-yidnKxopdy2w0iJ2r5nhkwPfab6mmiVADiW-TEQfBGP6vwk-xHp38XvtXlII4XmZJ3dYcyTQ-gfAdzyE6dGrtnj2FsA', 'Apparel', ARRAY[]::TEXT[], 8, 'APP-JERS-RD', '{}', FALSE, 0),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pro Grip Tape (Blue)', 'Generic', 8.50, NULL, 4.8, 210, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ugq4OGgGAkOh-aeQPBeHw62gM-AGieJh6zzOVEGlgEfMf7G-9_V3CgOrX0PreU_tna9E9s9i6nfj6T-vzIzoI-oUdDK--4TVAn5_g0eggmToG5cyNLnjMFN4llis8vFxRYp5pcqSbdusQZIf0dTsKraOAv3p1UEtCroWvl5BU0iPAnAXaXylXPESsf2Ah4-9Vodp3d5-4ddEqXmQs4wNKn1Cu-bz5avye1cTgThUOyTmoYTyGMooSBZG8xD67a8qzXyLVrU61Q', 'Accessories', ARRAY[]::TEXT[], 42, 'AC-GRIP-BL', '{}', FALSE, 0),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Victor P9200 Court Shoes', 'Victor', 140.00, NULL, 4.5, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUM9KOEgTAcNEsAmVSVxgLalSu8FNqiN_XeR58lxgfcxi0NCnN_9ZXsayOIcP8mkktDqd0LFkcDxNdCfu9JsRwp5sgX6YF-TFhsGIyOZJIuZ3S677IPJXSmDkRqWnHE76hy6o_tdKQQEGYZirfjOTRM-mhzVb_u_-AImxoHASw2dU8cYm0P4fVO0P2p_2yYZ2_HUBHlw5amKpHMunodc3nCXYnaUun-6AFvZc4WsWbhS7LA38MaT7xnRqljwu4O_xpEQfMmyXr9g', 'Footwear', ARRAY[]::TEXT[], 12, NULL, '{}', FALSE, 0),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Pro Tournament Tee', 'Li-Ning', 35.00, NULL, 4.3, 12, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzUsvG9hq79v_udfG1BhHkj37tQM9dtfA7ZkHDTWRQQeDh-l6UqE8mn2xCbzLWdrjoWmYsZ07kkcvNAlh_2jVzBmZwehbaIa8aeWumhjqSbSl5bo6MtCoqk7ON99IM8yxww_SSlecAwWW5dLX8Zinw7_blpemXjvBMzJ7-Cj1-9T9KdDAoztpAWe0zzHBsa29sqCcYpj4tJk7cWZBI8SrWE_OHznVpuKB8pf9aYdnErD48-DBgiyXnLBnpe8TZXM4kXMEOaF3OhQ', 'Apparel', ARRAY[]::TEXT[], 45, NULL, '{}', FALSE, 0)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- SEED DATA - Initial Reviews
-- ===========================================
INSERT INTO reviews (product_id, user_name, avatar_color, verified, rating, text, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John D.', 'bg-primary/20 text-primary', TRUE, 5, 'Incredible power on smashes. The control is slightly tricky at first, but once you get used to it, it''s a beast on the court. Highly recommend for singles players.', NOW() - INTERVAL '2 days'),
    ('11111111-1111-1111-1111-111111111111', 'Sarah L.', 'bg-purple-100 text-purple-600', TRUE, 4, 'The racket feels amazing, very stiff and responsive. The paint job looks even better in person. Delivery was super fast too!', NOW() - INTERVAL '1 week'),
    ('11111111-1111-1111-1111-111111111111', 'Mike K.', 'bg-green-100 text-green-600', TRUE, 4.5, 'Upgrade from the Astrox 88D. Definitely feels heavier on the head but the smashes are noticeably more powerful. Great service from BadmintonPro.', NOW() - INTERVAL '2 weeks')
ON CONFLICT DO NOTHING;

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PRODUCTS POLICIES
-- ===========================================
-- Allow public read access to products
CREATE POLICY "Products are publicly readable" ON products
    FOR SELECT TO anon, authenticated
    USING (true);

-- ===========================================
-- PRODUCT IMAGES POLICIES
-- ===========================================
-- Allow public read access to product images
CREATE POLICY "Product images are publicly readable" ON product_images
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow all operations on product images (for admin)
CREATE POLICY "Allow all operations on product_images" ON product_images
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ===========================================
-- REVIEWS POLICIES
-- ===========================================
-- Allow public read access to reviews
CREATE POLICY "Reviews are publicly readable" ON reviews
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow anyone to insert reviews (for demo mode)
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- ===========================================
-- ORDERS POLICIES
-- ===========================================
-- Allow public read/create access to orders (for demo mode)
CREATE POLICY "Orders are publicly readable" ON orders
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- ===========================================
-- ORDER ITEMS POLICIES
-- ===========================================
CREATE POLICY "Order items are publicly readable" ON order_items
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- ===========================================
-- WISHLISTS POLICIES (open for demo, restrict when auth is configured)
-- ===========================================
CREATE POLICY "Wishlists are readable" ON wishlists
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can modify wishlists" ON wishlists
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ===========================================
-- CARTS POLICIES (open for demo, restrict when auth is configured)
-- ===========================================
CREATE POLICY "Carts are readable" ON carts
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can modify carts" ON carts
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ===========================================
-- ADMIN POLICIES
-- Note: Admin operations should use service_role key
-- which bypasses RLS automatically
-- ===========================================

-- ===========================================
-- ENHANCED SECURITY (Optional - Enable when Supabase Auth is configured)
-- Uncomment the section below after configuring Supabase Auth to enable
-- user-specific data protection.
-- ===========================================
/*
-- Drop the permissive demo policies first before creating these

-- Reviews: Users can only modify their own reviews
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
CREATE POLICY "Authenticated users can insert reviews" ON reviews
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Orders: Users can only view/create their own orders
DROP POLICY IF EXISTS "Orders are publicly readable" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Wishlists: Users can only access their own wishlist
DROP POLICY IF EXISTS "Wishlists are readable" ON wishlists;
DROP POLICY IF EXISTS "Anyone can modify wishlists" ON wishlists;
CREATE POLICY "Users can view own wishlist" ON wishlists
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlists
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Carts: Users can only access their own cart
DROP POLICY IF EXISTS "Carts are readable" ON carts;
DROP POLICY IF EXISTS "Anyone can modify carts" ON carts;
CREATE POLICY "Users can view own cart" ON carts
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON carts
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
*/
