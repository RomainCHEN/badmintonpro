-- Migration: Add Localization Columns to Products Table
-- Run this in your Supabase SQL Editor to enable Chinese localization

-- ===========================================
-- ADD LOCALIZATION COLUMNS
-- ===========================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_cn TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS description_cn TEXT;

-- ===========================================
-- UPDATE EXISTING PRODUCTS WITH CHINESE DATA
-- ===========================================
UPDATE products SET 
    name_cn = '天斧99 Pro',
    description = 'Ultimate power racket for aggressive players. Designed for explosive smashes and precise control.',
    description_cn = '为进攻型选手打造的极致力量球拍。专为爆发式扣杀和精准控制而设计。'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE products SET 
    name_cn = '突击鬼爪',
    description = 'Power-focused racket with exceptional head weight for devastating attacks.',
    description_cn = '重头攻击型球拍，头重设计提供毁灭性的攻击力。'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE products SET 
    name_cn = '动力垫65Z',
    description = 'Professional badminton shoes with superior cushioning and stability.',
    description_cn = '专业羽毛球鞋，卓越的缓震性能与稳定性。'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE products SET 
    name_cn = 'AS-50羽毛球 (一打)',
    description = 'Tournament-grade feather shuttlecocks with excellent durability and flight.',
    description_cn = '比赛级羽毛球，优异的耐用性和飞行稳定性。'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE products SET 
    name_cn = '风刃9000 战斗版',
    description = 'All-round racket with balanced performance for versatile play styles.',
    description_cn = '全面型球拍，平衡的性能适合多种打法。'
WHERE id = '55555555-5555-5555-5555-555555555555';

UPDATE products SET 
    name_cn = '疾光800 LT',
    description = 'Lightweight speed racket for quick reactions and fast swings.',
    description_cn = '轻量速度型球拍，快速反应和极速挥拍。'
WHERE id = '66666666-6666-6666-6666-666666666666';

UPDATE products SET 
    name_cn = '弓剑11 Pro',
    description = 'Precision control racket with excellent repulsion and accuracy.',
    description_cn = '精准控制型球拍，出色的反弹力和准确性。'
WHERE id = '77777777-7777-7777-7777-777777777777';

UPDATE products SET 
    name_cn = '亮剑90K 金属版',
    description = 'Speed-focused racket with responsive shaft for quick attacks.',
    description_cn = '速度型球拍，响应灵敏的中杆，快速进攻利器。'
WHERE id = '88888888-8888-8888-8888-888888888888';

UPDATE products SET 
    name_cn = '李宁突击6代 蓝色',
    description = 'Professional court shoes with excellent grip and ankle support.',
    description_cn = '专业球鞋，出色的抓地力和脚踝支撑。'
WHERE id = '99999999-9999-9999-9999-999999999999';

UPDATE products SET 
    name_cn = '李宁团队球衣',
    description = 'Breathable team jersey with moisture-wicking fabric.',
    description_cn = '透气团队球衣，吸湿排汗面料。'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE products SET 
    name_cn = '专业手胶 (蓝色)',
    description = 'High-quality grip tape with excellent sweat absorption.',
    description_cn = '高品质手胶，出色的吸汗性能。'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

UPDATE products SET 
    name_cn = '威克多P9200球鞋',
    description = 'Lightweight court shoes with responsive cushioning system.',
    description_cn = '轻量球鞋，响应式缓震系统。'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

UPDATE products SET 
    name_cn = '专业比赛T恤',
    description = 'Competition-grade t-shirt with advanced cooling technology.',
    description_cn = '比赛级T恤，先进的冷却技术。'
WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

-- Verify the update
SELECT id, name, name_cn, description, description_cn FROM products LIMIT 5;
