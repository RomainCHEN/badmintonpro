import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CartItem, Order } from '../types';
import { ORDERS } from '../constants';

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CreateOrderInput {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    userId?: string; // Optional - for authenticated users
}

export interface OrderDetails extends Order {
    shippingAddress: ShippingAddress;
    items: CartItem[];
}

// Generate order number
const generateOrderNumber = (): string => {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `#${prefix}-${timestamp}${random}`;
};

// Format date for display
const formatOrderDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Create a new order
export const createOrder = async (input: CreateOrderInput): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
        console.log('[OrderService] Using mock mode - Order not actually created');
        // Return a mock order for demo
        const mockOrder: Order = {
            id: generateOrderNumber(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: input.total,
            status: 'Processing',
        };
        return mockOrder;
    }

    try {
        const orderNumber = generateOrderNumber();

        // Create order
        const { data: orderData, error: orderError } = await supabase!
            .from('orders')
            .insert({
                user_id: input.userId || null,
                order_number: orderNumber,
                subtotal: input.subtotal,
                shipping: input.shipping,
                tax: input.tax,
                total: input.total,
                status: 'Processing',
                shipping_address: input.shippingAddress,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = input.items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await supabase!
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return {
            id: orderNumber,
            date: formatOrderDate(orderData.created_at),
            total: parseFloat(orderData.total),
            status: orderData.status,
        };
    } catch (error) {
        console.error('[OrderService] Error creating order:', error);
        return null;
    }
};

// Get all orders (optionally filtered by user)
export const getOrders = async (userId?: string): Promise<Order[]> => {
    if (!isSupabaseConfigured()) {
        console.log('[OrderService] Using mock data - Supabase not configured');
        return ORDERS;
    }

    try {
        let query = supabase!
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        // Filter by user if userId provided
        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return (data || []).map(row => ({
            id: row.order_number,
            date: formatOrderDate(row.created_at),
            total: parseFloat(row.total),
            status: row.status as Order['status'],
        }));
    } catch (error) {
        console.error('[OrderService] Error fetching orders:', error);
        return ORDERS;
    }
};

// Get order by ID
export const getOrderById = async (orderNumber: string): Promise<OrderDetails | null> => {
    if (!isSupabaseConfigured()) {
        const mockOrder = ORDERS.find(o => o.id === orderNumber);
        if (!mockOrder) return null;
        return {
            ...mockOrder,
            shippingAddress: {
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@example.com',
                phone: '123-456-7890',
                address: '123 Demo Street',
                city: 'Demo City',
                state: 'DC',
                zipCode: '12345',
                country: 'USA',
            },
            items: [],
        };
    }

    try {
        const { data: orderData, error: orderError } = await supabase!
            .from('orders')
            .select('*')
            .eq('order_number', orderNumber)
            .single();

        if (orderError) throw orderError;
        if (!orderData) return null;

        const { data: itemsData, error: itemsError } = await supabase!
            .from('order_items')
            .select('*')
            .eq('order_id', orderData.id);

        if (itemsError) throw itemsError;

        return {
            id: orderData.order_number,
            date: formatOrderDate(orderData.created_at),
            total: parseFloat(orderData.total),
            status: orderData.status,
            shippingAddress: orderData.shipping_address,
            items: (itemsData || []).map(item => ({
                id: item.product_id,
                name: item.product_name,
                brand: '',
                price: parseFloat(item.price),
                rating: 0,
                reviews: 0,
                image: item.product_image || '',
                category: '',
                stock: 0,
                quantity: item.quantity,
            })),
        };
    } catch (error) {
        console.error('[OrderService] Error fetching order:', error);
        return null;
    }
};
