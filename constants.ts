import { Product, Review, Order } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Astrox 99 Pro",
    name_cn: "天斧99 Pro",
    description: "Ultimate power racket for aggressive players. Designed for explosive smashes and precise control.",
    description_cn: "为进攻型选手打造的极致力量球拍。专为爆发式扣杀和精准控制而设计。",
    brand: "Yonex",
    price: 219.00,
    originalPrice: 245.00,
    rating: 4.8,
    reviews: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnIHS2PRwUaGt4O-guEsjZ3olKfT4JLtl4rwXCQl1pWHnqN8NCRTm-cunv2kJEVlshfTTFpjvvBBPY_FXEI7k2xGTqfJz2rQgH5M5EHLk-e9Bff29LkS48oLoEsEU5bOzTHormSRDviMViHCjg_AyOkbq2D7EvncBCUF7KCifLPy-Fac-06xKVlzFLhSsyx94podkic-ctPZuSZ-P-0OXtBsKz42wQhFVVa1i1WWhiy_QGD-OBE214W-ZO5Lx4Bxpj2ewTTy1Fyw",
    category: "Rackets",
    tags: ["New", "Sale"],
    stock: 12,
    sku: "YNX-AST99",
    specs: { weight: "4U", balance: "Head Heavy", flex: "Stiff", grip: "G5" },
    isNew: true,
    salePercentage: 15
  },
  {
    id: "2",
    name: "Thruster F Claw",
    name_cn: "突击鬼爪",
    description: "Power-focused racket with exceptional head weight for devastating attacks.",
    description_cn: "重头攻击型球拍，头重设计提供毁灭性的攻击力。",
    brand: "Victor",
    price: 185.00,
    originalPrice: 218.00,
    rating: 4.7,
    reviews: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOrwenQOE3jAbcSOmq9OwcYUR2p4YTPjWHlYs53EPXsz-7QBwg8rVrTIJd-lfr2qYXXrgphCc-iL9OwUQDtzSKvY0OxcI9SeyDymcR1BQKQXZ0bvGSIL2JuCNxfT-pXrHu0M7Dj9a9X4fK9crA6v8aaptL6f7doHWw8d4S2miu81jI-Cybrm7M7l4qtZKfiuNQq9Uo2VYwnymrzdTEWD9LoaFywohTYILNt-_TkTXmgKfbietuKWPa26_so55jBZ0tMV4xgWyTMw",
    category: "Rackets",
    stock: 8,
    specs: { weight: "3U", balance: "Head Heavy" },
    salePercentage: 15
  },
  {
    id: "3",
    name: "Power Cushion 65 Z",
    name_cn: "动力垫65Z",
    description: "Professional badminton shoes with superior cushioning and stability.",
    description_cn: "专业羽毛球鞋，卓越的缓震性能与稳定性。",
    brand: "Yonex",
    price: 145.00,
    rating: 4.5,
    reviews: 128,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQw9fWkV_qdyHt9A9EFxrFAPoliEDb2ZlnXnUoINkcEfyD0m_Acg1izCJfuXSpxgrPvCergIc4fPtNAXUPLOyenuF2ueVh560cpENySOVD5YLJszlB3QM93-VBSlmP-_ngeUG0yEaVJaiM9rFx2d45skygaRXyRJ2YL3dqqXrQDpfM1yexsOYQrKqbAsIn2AegOhB5_I7WRHIJ9IT5m8DWxGkAjfpTdssXCnU0Iv4qkSS4WlWqHbM-BdgM2MnPHdGLShe0WnScbg",
    category: "Footwear",
    stock: 25,
    sku: "YNX-PC65Z"
  },
  {
    id: "4",
    name: "Aerosensa 50 (Dozen)",
    name_cn: "AS-50羽毛球 (一打)",
    description: "Tournament-grade feather shuttlecocks with excellent durability and flight.",
    description_cn: "比赛级羽毛球，优异的耐用性和飞行稳定性。",
    brand: "Yonex",
    price: 35.00,
    rating: 5.0,
    reviews: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNhrt45WO39D_nmwnYA8qxgkN_Onb-LPTwnRbVCCAzo-_fcFG_Oql8rTjd4H29ACi3JQBKtnEVJTyKR7Ds8nH0um_hs6Z_VQZIMgmD_wNrEXs-JUobR8cdKnZyykOZQqd6yZkb_xWIoVJeUkwucCT-pJ8KiuXVOlrGPHcxT20dkPUL4aN38tCSnKVP0iu3vQmfIa2MGn3io5VChh29PTBb-STrcZYOHwgntC7o-v7sJ43m_P4EsAMy5YYcisXkoWyogm8uCq44Bg",
    category: "Accessories",
    stock: 150,
    sku: "YNX-AS50"
  },
  {
    id: "5",
    name: "Aeronaut 9000 Combat",
    name_cn: "风刃9000 战斗版",
    description: "All-round racket with balanced performance for versatile play styles.",
    description_cn: "全面型球拍，平衡的性能适合多种打法。",
    brand: "Li-Ning",
    price: 230.00,
    rating: 4.6,
    reviews: 42,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY9ca6Bhe3HzRNxZ3ea1SIBv9eGIIS9Vylhgr4bqm5YmYuzvh5q1obABiit4eiZ1wwHqNUQzpNG_pml7lbOVQKLB6XoXT74y3dD1aHs4Jd97AOFKduAz8Us_LUyzEv2QsQzLEP4kBx2-2D8mHtBEuIy0J3r4APj7Wn_gqny45YQl41igItpKLlMRqDySxiFpdQeYntdF3VcTsbNyu3BG7xcbJMCba49RpIQ93CfW233-x0xPDBNSKxsgA9qC164RdyEmbtRvOHKA",
    category: "Rackets",
    stock: 5,
    specs: { weight: "3U", balance: "Head Heavy" }
  },
  {
    id: "6",
    name: "Nanoflare 800 LT",
    name_cn: "疾光800 LT",
    description: "Lightweight speed racket for quick reactions and fast swings.",
    description_cn: "轻量速度型球拍，快速反应和极速挥拍。",
    brand: "Yonex",
    price: 195.00,
    rating: 4.7,
    reviews: 65,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZM7HCeAvLivHncPlXlvkKbTb4tM1ldmrk_1sb_pO0ZWLcqfIxom7qhYkRh4QWlmhXyh_IrHgd8OBfeXuM3uXtD7V2E8uSd7kwgm-EBZSJM69w5Ry8fOssh24fZAKD7gMTKWclkmiEZ70Lu3MfPQr33M92Vz_cJVpfQZcwTXj7J-KBieCjGJ4X3WEArzmh0F7ymBGi8hQzqWeezsNcOT_Ky8nVJMvH9umWjPcDjBRx4-me6uQvZDnE73SqR241dhyfTP_HhxJ6gw",
    category: "Rackets",
    stock: 10,
    specs: { weight: "5U", balance: "Head Light" }
  },
  {
    id: "7",
    name: "Arcsaber 11 Pro",
    name_cn: "弓剑11 Pro",
    description: "Precision control racket with excellent repulsion and accuracy.",
    description_cn: "精准控制型球拍，出色的反弹力和准确性。",
    brand: "Yonex",
    price: 205.00,
    rating: 4.9,
    reviews: 200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvbgfE-ZJbXXGP3YNGdO1k3K_Lp2uSZmvzQ3otBQRTVthJpDUNK4sTURbN-Yxvv1dhcM1dDAoAHzH_V0TpbzKt7GrEeSiWh-4EkQLPeuFJNqQgviQelqHv2fz5bbQoodaxyWhCej4zKLnwm98pQG6JVEX3gDGeE4LwiE1cTXmD4PkzofkB2xq10xp-RJKbtdYrHCzEkO-y9y79Knu3lFuTDHQeL8BqD3Db_IbNOKkVPbmkAQwbGHqVU4a-MOMLjIwVjYlOvZvr5w",
    category: "Rackets",
    stock: 18,
    tags: ["Best Seller"],
    specs: { weight: "3U", balance: "Even Balance" }
  },
  {
    id: "8",
    name: "Auraspeed 90K Metallic",
    name_cn: "亮剑90K 金属版",
    description: "Speed-focused racket with responsive shaft for quick attacks.",
    description_cn: "速度型球拍，响应灵敏的中杆，快速进攻利器。",
    brand: "Victor",
    price: 175.00,
    rating: 4.6,
    reviews: 34,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyGBdq7-VqlMR92JlARlEkiXW0XcVmHKEjX8Nu5OE5oRnmaoD499_EfI3_4DAR8TGD4ydqf_4IKz2hx1XVy__QLaqYVJXzMRQ_XIaDOZJGkayaUFaWqnGU9Ua5mWDwMi6aZuPPgdIMgaIQoP0ZzXt8LvgEnxqVE8ja6Jwx0cBRhHvVK7KBWm5akSfdOrRgXQzxV1hzfPH5cRCCzsid05KcE1jdagkAVo7SHCSVbNd_o5O3C1RAYCgyrJSfi7bLXQ5tSbmlvxK9kA",
    category: "Rackets",
    stock: 7,
    specs: { weight: "4U", balance: "Head Light" }
  },
  {
    id: "9",
    name: "Li-Ning Ranger VI - Blue",
    name_cn: "李宁突击6代 蓝色",
    description: "Professional court shoes with excellent grip and ankle support.",
    description_cn: "专业球鞋，出色的抓地力和脚踝支撑。",
    brand: "Li-Ning",
    price: 145.00,
    rating: 4.4,
    reviews: 56,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw9kKZV2LtZzw4Ex-yk82w6snuzsGWe96AhqAcOBr4cb-lqJdkh6fEmBTH54nWwroeYFkI27j8klXCaEekm3zJevumVPLS-C1zFh5YNklwbZePg-KFBnCeueo5SewTsz8SjkwW97bkQybYtrIYfAZnNIrYhf-9V6HPREdLIrP1ZyS5zi-CPUSXqifSQkZOnVs0jJamzPu1GX6c5KGKDsyKPeD-BbBiBdm4h7q485gMpYX16xNrhihJtLpteLTJ6_K56s1IkdBarw",
    category: "Footwear",
    stock: 3,
    sku: "LIN-RNG6"
  },
  {
    id: "10",
    name: "Li-Ning Team Jersey",
    name_cn: "李宁团队球衣",
    description: "Breathable team jersey with moisture-wicking fabric.",
    description_cn: "透气团队球衣，吸湿排汗面料。",
    brand: "Li-Ning",
    price: 45.00,
    rating: 4.2,
    reviews: 40,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEojS6Wi3N7_an9bSrpHp1KsJR9sPCySfxfVc3cXYm4gRxFlraYRDVPYtGQwgdOEjhsT70Zmait_S89rXP7-vFumMgUinbHPrbChVt1W8cr9yuVAu5oPneemeh8p5keRfcbgKP2li38kQFR8cj59dNxpA4RF2FiCXtYekEzOR7ytitgf-yidnKxopdy2w0iJ2r5nhkwPfab6mmiVADiW-TEQfBGP6vwk-xHp38XvtXlII4XmZJ3dYcyTQ-gfAdzyE6dGrtnj2FsA",
    category: "Apparel",
    stock: 8,
    sku: "APP-JERS-RD"
  },
  {
    id: "11",
    name: "Pro Grip Tape (Blue)",
    name_cn: "专业手胶 (蓝色)",
    description: "High-quality grip tape with excellent sweat absorption.",
    description_cn: "高品质手胶，出色的吸汗性能。",
    brand: "Generic",
    price: 8.50,
    rating: 4.8,
    reviews: 210,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ugq4OGgGAkOh-aeQPBeHw62gM-AGieJh6zzOVEGlgEfMf7G-9_V3CgOrX0PreU_tna9E9s9i6nfj6T-vzIzoI-oUdDK--4TVAn5_g0eggmToG5cyNLnjMFN4llis8vFxRYp5pcqSbdusQZIf0dTsKraOAv3p1UEtCroWvl5BU0iPAnAXaXylXPESsf2Ah4-9Vodp3d5-4ddEqXmQs4wNKn1Cu-bz5avye1cTgThUOyTmoYTyGMooSBZG8xD67a8qzXyLVrU61Q",
    category: "Accessories",
    stock: 42,
    sku: "AC-GRIP-BL"
  },
  {
    id: "12",
    name: "Victor P9200 Court Shoes",
    name_cn: "威克多P9200球鞋",
    description: "Lightweight court shoes with responsive cushioning system.",
    description_cn: "轻量球鞋，响应式缓震系统。",
    brand: "Victor",
    price: 140.00,
    rating: 4.5,
    reviews: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUM9KOEgTAcNEsAmVSVxgLalSu8FNqiN_XeR58lxgfcxi0NCnN_9ZXsayOIcP8mkktDqd0LFkcDxNdCfu9JsRwp5sgX6YF-TFhsGIyOZJIuZ3S677IPJXSmDkRqWnHE76hy6o_tdKQQEGYZirfjOTRM-mhzVb_u_-AImxoHASw2dU8cYm0P4fVO0P2p_2yYZ2_HUBHlw5amKpHMunodc3nCXYnaUun-6AFvZc4WsWbhS7LA38MaT7xnRqljwu4O_xpEQfMmyXr9g",
    category: "Footwear",
    stock: 12
  },
  {
    id: "13",
    name: "Pro Tournament Tee",
    name_cn: "专业比赛T恤",
    description: "Competition-grade t-shirt with advanced cooling technology.",
    description_cn: "比赛级T恤，先进的冷却技术。",
    brand: "Li-Ning",
    price: 35.00,
    rating: 4.3,
    reviews: 12,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzUsvG9hq79v_udfG1BhHkj37tQM9dtfA7ZkHDTWRQQeDh-l6UqE8mn2xCbzLWdrjoWmYsZ07kkcvNAlh_2jVzBmZwehbaIa8aeWumhjqSbSl5bo6MtCoqk7ON99IM8yxww_SSlecAwWW5dLX8Zinw7_blpemXjvBMzJ7-Cj1-9T9KdDAoztpAWe0zzHBsa29sqCcYpj4tJk7cWZBI8SrWE_OHznVpuKB8pf9aYdnErD48-DBgiyXnLBnpe8TZXM4kXMEOaF3OhQ",
    category: "Apparel",
    stock: 45
  }
];

// Product-specific reviews - each product has its own reviews
// Keys match both simple IDs (for mock mode) and UUID format (for Supabase)
export const PRODUCT_REVIEWS: Record<string, Review[]> = {
  // Astrox 99 Pro - Product ID: 1 / 11111111-1111-1111-1111-111111111111
  "1": [
    { id: "1-1", user: "John D.", avatarColor: "bg-primary/20 text-primary", verified: true, date: "2 days ago", rating: 5, text: "Incredible power on smashes. The control is slightly tricky at first, but once you get used to it, it's a beast on the court. Highly recommend for singles players." },
    { id: "1-2", user: "Sarah L.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "1 week ago", rating: 5, text: "The racket feels amazing, very stiff and responsive. The paint job looks even better in person. Delivery was super fast too!" },
    { id: "1-3", user: "Mike K.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "2 weeks ago", rating: 5, text: "Upgrade from the Astrox 88D. Definitely feels heavier on the head but the smashes are noticeably more powerful. Great service from BadmintonPro." },
  ],
  "11111111-1111-1111-1111-111111111111": [
    { id: "uuid1-1", user: "John D.", avatarColor: "bg-primary/20 text-primary", verified: true, date: "2 days ago", rating: 5, text: "Incredible power on smashes. The control is slightly tricky at first, but once you get used to it, it's a beast on the court. Highly recommend for singles players." },
    { id: "uuid1-2", user: "Sarah L.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "1 week ago", rating: 5, text: "The racket feels amazing, very stiff and responsive. The paint job looks even better in person. Delivery was super fast too!" },
    { id: "uuid1-3", user: "Mike K.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "2 weeks ago", rating: 5, text: "Upgrade from the Astrox 88D. Definitely feels heavier on the head but the smashes are noticeably more powerful. Great service from BadmintonPro." },
  ],
  // Thruster F Claw - Product ID: 2 / 22222222-2222-2222-2222-222222222222
  "2": [
    { id: "2-1", user: "Alex W.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "3 days ago", rating: 5, text: "Victor's best racket for smashing! The head-heavy balance gives incredible power. Perfect for attacking players." },
    { id: "2-2", user: "Chen Wei", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 4, text: "重头设计非常适合杀球，力量感十足。价格也很合理，推荐给进攻型选手。" },
  ],
  "22222222-2222-2222-2222-222222222222": [
    { id: "uuid2-1", user: "Alex W.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "3 days ago", rating: 5, text: "Victor's best racket for smashing! The head-heavy balance gives incredible power. Perfect for attacking players." },
    { id: "uuid2-2", user: "Chen Wei", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 4, text: "重头设计非常适合杀球，力量感十足。价格也很合理，推荐给进攻型选手。" },
  ],
  // Power Cushion 65 Z - Product ID: 3 / 33333333-3333-3333-3333-333333333333
  "3": [
    { id: "3-1", user: "Emily R.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "1 day ago", rating: 5, text: "Best badminton shoes I've ever owned! The cushioning is incredible - no more knee pain after long matches. Worth every penny." },
    { id: "3-2", user: "David K.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "5 days ago", rating: 4, text: "Excellent grip on the court. Took a few sessions to break in but now they're super comfortable. True to size." },
  ],
  "33333333-3333-3333-3333-333333333333": [
    { id: "uuid3-1", user: "Emily R.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "1 day ago", rating: 5, text: "Best badminton shoes I've ever owned! The cushioning is incredible - no more knee pain after long matches. Worth every penny." },
    { id: "uuid3-2", user: "David K.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "5 days ago", rating: 4, text: "Excellent grip on the court. Took a few sessions to break in but now they're super comfortable. True to size." },
  ],
  // Aerosensa 50 - Product ID: 4 / 44444444-4444-4444-4444-444444444444
  "4": [
    { id: "4-1", user: "James P.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 day ago", rating: 5, text: "Tournament quality shuttles at a reasonable price. Flight is consistent and they last longer than most feather shuttles. Our club now orders these exclusively." },
    { id: "4-2", user: "Wang Li", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "4 days ago", rating: 5, text: "非常好的羽毛球！飞行稳定，耐用度也不错。比赛训练都很合适。" },
  ],
  "44444444-4444-4444-4444-444444444444": [
    { id: "uuid4-1", user: "James P.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 day ago", rating: 5, text: "Tournament quality shuttles at a reasonable price. Flight is consistent and they last longer than most feather shuttles. Our club now orders these exclusively." },
    { id: "uuid4-2", user: "Wang Li", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "4 days ago", rating: 5, text: "非常好的羽毛球！飞行稳定，耐用度也不错。比赛训练都很合适。" },
  ],
  // Aeronaut 9000 Combat - Product ID: 5 / 55555555-5555-5555-5555-555555555555
  "5": [
    { id: "5-1", user: "Zhang Ming", avatarColor: "bg-primary/20 text-primary", verified: true, date: "2 days ago", rating: 5, text: "李宁的这款球拍非常全面，攻守兼备。碳纤维材质手感极佳，值得推荐！" },
    { id: "5-2", user: "Ryan T.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "1 week ago", rating: 4, text: "Great all-round racket from Li-Ning. Not as head-heavy as the Yonex Astrox series but offers better control for defensive play." },
  ],
  "55555555-5555-5555-5555-555555555555": [
    { id: "uuid5-1", user: "Zhang Ming", avatarColor: "bg-primary/20 text-primary", verified: true, date: "2 days ago", rating: 5, text: "李宁的这款球拍非常全面，攻守兼备。碳纤维材质手感极佳，值得推荐！" },
    { id: "uuid5-2", user: "Ryan T.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "1 week ago", rating: 4, text: "Great all-round racket from Li-Ning. Not as head-heavy as the Yonex Astrox series but offers better control for defensive play." },
  ],
  // Nanoflare 800 LT - Product ID: 6 / 66666666-6666-6666-6666-666666666666
  "6": [
    { id: "6-1", user: "Sophie H.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "3 days ago", rating: 5, text: "So light and fast! Perfect for quick reactions at the net. The 5U weight really makes a difference in fast doubles games." },
    { id: "6-2", user: "Lin Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 5, text: "疾光800真的很轻，挥速极快。适合双打前场选手，强烈推荐！" },
  ],
  "66666666-6666-6666-6666-666666666666": [
    { id: "uuid6-1", user: "Sophie H.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "3 days ago", rating: 5, text: "So light and fast! Perfect for quick reactions at the net. The 5U weight really makes a difference in fast doubles games." },
    { id: "uuid6-2", user: "Lin Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 5, text: "疾光800真的很轻，挥速极快。适合双打前场选手，强烈推荐！" },
  ],
  // Arcsaber 11 Pro - Product ID: 7 / 77777777-7777-7777-7777-777777777777
  "7": [
    { id: "7-1", user: "Andrew Z.", avatarColor: "bg-primary/20 text-primary", verified: true, date: "1 day ago", rating: 5, text: "The precision and control on this racket is unmatched. Perfect for placing shots exactly where you want them. Worth every dollar!" },
    { id: "7-2", user: "Rachel K.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "3 days ago", rating: 5, text: "Best racket for all-round play. Great balance between power and control. The even-balance design is perfect for my playing style." },
    { id: "7-3", user: "Liu Yang", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 week ago", rating: 5, text: "弓剑系列一直是控制型球拍的标杆，这款Pro更是精品中的精品！" },
  ],
  "77777777-7777-7777-7777-777777777777": [
    { id: "uuid7-1", user: "Andrew Z.", avatarColor: "bg-primary/20 text-primary", verified: true, date: "1 day ago", rating: 5, text: "The precision and control on this racket is unmatched. Perfect for placing shots exactly where you want them. Worth every dollar!" },
    { id: "uuid7-2", user: "Rachel K.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "3 days ago", rating: 5, text: "Best racket for all-round play. Great balance between power and control. The even-balance design is perfect for my playing style." },
    { id: "uuid7-3", user: "Liu Yang", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 week ago", rating: 5, text: "弓剑系列一直是控制型球拍的标杆，这款Pro更是精品中的精品！" },
  ],
  // Auraspeed 90K Metallic - Product ID: 8 / 88888888-8888-8888-8888-888888888888
  "8": [
    { id: "8-1", user: "Brian C.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "4 days ago", rating: 5, text: "Victor's response to the Nanoflare series. Super quick racket with good punch. The metallic finish looks stunning!" },
    { id: "8-2", user: "Jessica W.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "1 week ago", rating: 4, text: "Fast and responsive. Great for quick exchanges at the net. Slightly less powerful than my old Thruster but much faster." },
  ],
  "88888888-8888-8888-8888-888888888888": [
    { id: "uuid8-1", user: "Brian C.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "4 days ago", rating: 5, text: "Victor's response to the Nanoflare series. Super quick racket with good punch. The metallic finish looks stunning!" },
    { id: "uuid8-2", user: "Jessica W.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "1 week ago", rating: 4, text: "Fast and responsive. Great for quick exchanges at the net. Slightly less powerful than my old Thruster but much faster." },
  ],
  // Li-Ning Ranger VI - Product ID: 9 / 99999999-9999-9999-9999-999999999999
  "9": [
    { id: "9-1", user: "Amanda G.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "2 days ago", rating: 5, text: "Love the blue color! Great grip on court and excellent ankle support. Perfect for intense matches. Very comfortable right out of the box." },
    { id: "9-2", user: "Zhou Chen", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 week ago", rating: 4, text: "李宁的鞋子质量一如既往的好，这款突击6代脚踝支撑做得很到位。蓝色很好看。" },
  ],
  "99999999-9999-9999-9999-999999999999": [
    { id: "uuid9-1", user: "Amanda G.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "2 days ago", rating: 5, text: "Love the blue color! Great grip on court and excellent ankle support. Perfect for intense matches. Very comfortable right out of the box." },
    { id: "uuid9-2", user: "Zhou Chen", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 week ago", rating: 4, text: "李宁的鞋子质量一如既往的好，这款突击6代脚踝支撑做得很到位。蓝色很好看。" },
  ],
  // Li-Ning Team Jersey - Product ID: 10 / aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
  "10": [
    { id: "10-1", user: "Nancy L.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "5 days ago", rating: 4, text: "Nice breathable fabric, keeps me cool during long matches. True to size and the color hasn't faded after multiple washes." },
    { id: "10-2", user: "Robert J.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "2 weeks ago", rating: 4, text: "Good quality team jersey at a reasonable price. Ordered for our club and everyone is happy with them." },
  ],
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa": [
    { id: "uuida-1", user: "Nancy L.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "5 days ago", rating: 4, text: "Nice breathable fabric, keeps me cool during long matches. True to size and the color hasn't faded after multiple washes." },
    { id: "uuida-2", user: "Robert J.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "2 weeks ago", rating: 4, text: "Good quality team jersey at a reasonable price. Ordered for our club and everyone is happy with them." },
  ],
  // Pro Grip Tape - Product ID: 11 / bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
  "11": [
    { id: "11-1", user: "Tim H.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 day ago", rating: 5, text: "Best grip tape I've used! Absorbs sweat really well and lasts longer than the Yonex AC102. Great value for money." },
    { id: "11-2", user: "Xu Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "4 days ago", rating: 5, text: "吸汗效果非常好，手感舒适。性价比超高，已经回购多次了！" },
  ],
  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb": [
    { id: "uuidb-1", user: "Tim H.", avatarColor: "bg-green-100 text-green-600", verified: true, date: "1 day ago", rating: 5, text: "Best grip tape I've used! Absorbs sweat really well and lasts longer than the Yonex AC102. Great value for money." },
    { id: "uuidb-2", user: "Xu Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "4 days ago", rating: 5, text: "吸汗效果非常好，手感舒适。性价比超高，已经回购多次了！" },
  ],
  // Victor P9200 Court Shoes - Product ID: 12 / cccccccc-cccc-cccc-cccc-cccccccccccc
  "12": [
    { id: "12-1", user: "Michelle T.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "2 days ago", rating: 5, text: "Super lightweight and comfortable! The cushioning system is amazing - feels like walking on clouds. Great for all-day tournaments." },
    { id: "12-2", user: "Wang Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 4, text: "威克多的鞋子做工精细，这款P9200缓震系统很出色。推荐！" },
  ],
  "cccccccc-cccc-cccc-cccc-cccccccccccc": [
    { id: "uuidc-1", user: "Michelle T.", avatarColor: "bg-pink-100 text-pink-600", verified: true, date: "2 days ago", rating: 5, text: "Super lightweight and comfortable! The cushioning system is amazing - feels like walking on clouds. Great for all-day tournaments." },
    { id: "uuidc-2", user: "Wang Xiaoming", avatarColor: "bg-orange-100 text-orange-600", verified: true, date: "1 week ago", rating: 4, text: "威克多的鞋子做工精细，这款P9200缓震系统很出色。推荐！" },
  ],
  // Pro Tournament Tee - Product ID: 13 / dddddddd-dddd-dddd-dddd-dddddddddddd
  "13": [
    { id: "13-1", user: "Karen W.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "3 days ago", rating: 4, text: "Love the cooling technology! Stays dry even during intense matches. Fits well and looks professional." },
    { id: "13-2", user: "Jason L.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "2 weeks ago", rating: 4, text: "Comfortable match tee. The fabric is soft and breathable. Would recommend ordering your regular size." },
  ],
  "dddddddd-dddd-dddd-dddd-dddddddddddd": [
    { id: "uuidd-1", user: "Karen W.", avatarColor: "bg-purple-100 text-purple-600", verified: true, date: "3 days ago", rating: 4, text: "Love the cooling technology! Stays dry even during intense matches. Fits well and looks professional." },
    { id: "uuidd-2", user: "Jason L.", avatarColor: "bg-blue-100 text-blue-600", verified: true, date: "2 weeks ago", rating: 4, text: "Comfortable match tee. The fabric is soft and breathable. Would recommend ordering your regular size." },
  ],
};

// Legacy export for backwards compatibility
export const REVIEWS: Review[] = PRODUCT_REVIEWS["1"] || [];

export const ORDERS: Order[] = [
  { id: "#ORD-4023", date: "Oct 24, 2023", total: 89.00, status: "Shipped" },
  { id: "#ORD-3901", date: "Sep 12, 2023", total: 210.50, status: "Delivered" },
];