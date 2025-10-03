// stores/useCartStore.ts
import type { MenuItem } from "../types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem extends MenuItem {
  quantity: number;
}

export type CartState = {
  cart: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string; // Added for visual display
  // Methods
  addToCart: (
    item: MenuItem,
    restaurantId?: string,
    restaurantName?: string,
    restaurantImage?: string
  ) => void;
  clearCart: () => void;
  removeFromTheCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setRestaurant: (
    restaurantId: string,
    restaurantName: string,
    restaurantImage?: string
  ) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
  getDeliveryFee: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      restaurantId: undefined,
      restaurantName: undefined,
      restaurantImage: undefined,

      addToCart: (
        item: MenuItem,
        restaurantId?: string,
        restaurantName?: string,
        restaurantImage?: string
      ) => {
        set((state) => {
          // Check if adding from different restaurant
          if (state.restaurantId && state.restaurantId !== restaurantId) {
            const confirmClear = window.confirm(
              "Your cart contains items from another restaurant. Would you like to clear the cart and add items from this restaurant?"
            );

            if (confirmClear) {
              return {
                cart: [{ ...item, quantity: 1 }],
                restaurantId,
                restaurantName,
                restaurantImage,
              };
            } else {
              return state;
            }
          }

          const existingItem = state.cart.find(
            (cartItem) => cartItem._id === item._id
          );

          if (existingItem) {
            // Item exists, increment quantity
            const updatedCart = state.cart.map((cartItem) =>
              cartItem._id === item._id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );

            toast.success(
              `Increased ${item.name} quantity to ${existingItem.quantity + 1}`,
              {
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }
            );

            return {
              cart: updatedCart,
              restaurantId: restaurantId || state.restaurantId,
              restaurantName: restaurantName || state.restaurantName,
              restaurantImage: restaurantImage || state.restaurantImage,
            };
          } else {
            // New item
            toast.success(`Added ${item.name} to cart`, {
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            });

            return {
              cart: [...state.cart, { ...item, quantity: 1 }],
              restaurantId: restaurantId || state.restaurantId,
              restaurantName: restaurantName || state.restaurantName,
              restaurantImage: restaurantImage || state.restaurantImage,
            };
          }
        });
      },

      clearCart: () => {
        set({
          cart: [],
          restaurantId: undefined,
          restaurantName: undefined,
          restaurantImage: undefined,
        });
        toast.info("Cart cleared", {
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        });
      },

      removeFromTheCart: (id: string) => {
        set((state) => {
          const item = state.cart.find((item) => item._id === id);
          const updatedCart = state.cart.filter((item) => item._id !== id);

          if (item) {
            toast.info(`Removed ${item.name} from cart`, {
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            });
          }

          // Clear restaurant info if cart is empty
          const newState: Partial<CartState> = { cart: updatedCart };
          if (updatedCart.length === 0) {
            newState.restaurantId = undefined;
            newState.restaurantName = undefined;
            newState.restaurantImage = undefined;
          }

          return newState;
        });
      },

      incrementQuantity: (id: string) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
          return { cart: updatedCart };
        });
      },

      decrementQuantity: (id: string) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

          // Clear restaurant info if cart is empty
          const newState: Partial<CartState> = { cart: updatedCart };
          if (updatedCart.length === 0) {
            newState.restaurantId = undefined;
            newState.restaurantName = undefined;
            newState.restaurantImage = undefined;
          }

          return newState;
        });
      },

      setRestaurant: (
        restaurantId: string,
        restaurantName: string,
        restaurantImage?: string
      ) => {
        set({ restaurantId, restaurantName, restaurantImage });
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getItemQuantity: (id: string) => {
        const { cart } = get();
        const item = cart.find((item) => item._id === id);
        return item ? item.quantity : 0;
      },

      isItemInCart: (id: string) => {
        const { cart } = get();
        return cart.some((item) => item._id === id);
      },

      getDeliveryFee: () => {
        const total = get().getCartTotal();
        return total > 0 ? 40 : 0; // ₹40 delivery fee
      },

      getTaxAmount: () => {
        const total = get().getCartTotal();
        return total * 0.05; // 5% tax
      },

      getGrandTotal: () => {
        const total = get().getCartTotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTaxAmount();
        return total + deliveryFee + tax;
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
