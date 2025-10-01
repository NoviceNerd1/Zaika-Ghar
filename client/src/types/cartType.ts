// import type { MenuItem } from "./restaurantType";

// export interface CartItem extends MenuItem {
//   quantity: number;
// }

// export type CartState = {
//   cart: CartItem[];
//   addToCart: (item: MenuItem) => void;
//   clearCart: () => void;
//   removeFromTheCart: (id: string) => void;
//   incrementQuantity: (id: string) => void;
//   decrementQuantity: (id: string) => void;
//   getCartTotal: () => number;
//   getCartItemsCount: () => number;
//   getItemQuantity: (id: string) => number;
//   isItemInCart: (id: string) => boolean;
// };

import type { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem {
  quantity: number;
}

export type CartState = {
  cart: CartItem[];
  restaurantId?: string;
  restaurantName?: string;
  addToCart: (
    item: MenuItem,
    restaurantId?: string,
    restaurantName?: string
  ) => void;
  clearCart: () => void;
  removeFromTheCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setRestaurant: (restaurantId: string, restaurantName: string) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
};
