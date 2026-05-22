import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';
import type { Product, CartItem, User } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existingItem = get().items.find(item => item.product.id === product.id);
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set(state => ({
            items: [...state.items, { product, quantity }],
          }));
        }
      },
      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const items = get().items;
        const exists = items.find(item => item.id === product.id);
        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const response = await api.post('/api/auth/login', { email, password });
          set({ user: response.data, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      signup: async (userData) => {
        try {
          const response = await api.post('/api/auth/signup', userData);
          set({ user: response.data, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Signup failed:', error);
          return false;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: 'user-storage',
    }
  )
);

interface AdminState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const response = await api.post('/api/admin/login', { email, password });
          if (response.data.success) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
);