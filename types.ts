export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  name_cn?: string; // Chinese product name
  description?: string;
  description_cn?: string; // Chinese description
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: ProductImage[];
  category: string;
  tags?: string[];
  stock: number;
  sku?: string;
  specs?: {
    weight?: string;
    grip?: string;
    balance?: string;
    flex?: string;
  };
  isNew?: boolean;
  salePercentage?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Shipped' | 'Delivered' | 'Processing';
}

export interface Review {
  id: string;
  user: string;
  avatarColor: string;
  verified: boolean;
  date: string;
  rating: number;
  text: string;
}
