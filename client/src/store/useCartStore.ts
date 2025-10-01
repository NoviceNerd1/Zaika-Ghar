import { type CartItem, type CartState } from "@/types/cartType";
import { type MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartStoreState = CartState & {
  restaurantId?: string;
  restaurantName?: string;
  setRestaurant: (restaurantId: string, restaurantName: string) => void;
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      restaurantId: undefined,
      restaurantName: undefined,

      addToCart: (
        item: MenuItem,
        restaurantId?: string,
        restaurantName?: string
      ) => {
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem._id === item._id
          );

          // If adding first item or changing restaurant, clear cart and set new restaurant
          if (
            state.cart.length === 0 ||
            (restaurantId && restaurantId !== state.restaurantId)
          ) {
            const cartItem: CartItem = { ...item, quantity: 1 };
            return {
              cart: [cartItem],
              restaurantId: restaurantId,
              restaurantName: restaurantName,
            };
          }

          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem._id === item._id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            const cartItem: CartItem = { ...item, quantity: 1 };
            return {
              cart: [...state.cart, cartItem],
            };
          }
        });
      },

      clearCart: () => {
        set({ cart: [], restaurantId: undefined, restaurantName: undefined });
      },

      removeFromTheCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        }));
      },

      incrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },

      decrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }));
      },

      setRestaurant: (restaurantId: string, restaurantName: string) => {
        set({ restaurantId, restaurantName });
      },

      // Additional utility methods
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      getItemQuantity: (id: string) => {
        const { cart } = get();
        const item = cart.find((cartItem) => cartItem._id === id);
        return item ? item.quantity : 0;
      },

      isItemInCart: (id: string) => {
        const { cart } = get();
        return cart.some((item) => item._id === id);
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
      }),
    }
  )
);
