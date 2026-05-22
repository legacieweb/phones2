export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isPremium?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: 'smartphones' | 'accessories' | 'tablets';
  images: string[];
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = Order['status'];
export type PaymentStatus = Order['paymentStatus'];