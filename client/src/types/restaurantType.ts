import type { Orders } from "./orderType";

// types/restaurantType.ts
export type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string; // Added for better organization
  isVegetarian?: boolean; // Added for filtering
  isAvailable?: boolean; // Added for availability tracking
};

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[];
  menus: MenuItem[];
  imageUrl: string;
  rating?: number; // Added for visual display
  location?: string; // Added for detailed address
  cost?: number; // Added for cost information
  contact?: string; // Added for contact info
  openingHours?: string; // Added for business hours
};

export type SearchedRestaurant = {
  data: Restaurant[];
  totalCount?: number; // Added for pagination info
  hasMore?: boolean; // Added for infinite scroll
};

export type RestaurantState = {
  loading: boolean;
  restaurant: Restaurant | null;
  searchedRestaurant: SearchedRestaurant | null;
  appliedFilter: string[];
  singleRestaurant: Restaurant | null;
  restaurantOrder: Orders[];
  // Visual state additions
  theme: "light" | "dark";
  viewMode: "grid" | "list";
  // Methods
  createRestaurant: (formData: FormData) => Promise<void>;
  getRestaurant: () => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  searchRestaurant: (
    searchText: string,
    searchQuery: string,
    selectedCuisines?: string[]
  ) => Promise<void>;
  addMenuToRestaurant: (menu: MenuItem) => void;
  updateMenuToRestaurant: (menu: MenuItem) => void;
  removeMenuFromRestaurant: (menuId: string) => void;
  setAppliedFilter: (value: string) => void;
  resetAppliedFilter: () => void;
  getSingleRestaurant: (restaurantId: string) => Promise<void>;
  getRestaurantOrders: () => Promise<void>;
  updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
  // Visual methods
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: "grid" | "list") => void;
  clearSearchedRestaurant: () => void;
  clearSingleRestaurant: () => void;
  clearRestaurantOrders: () => void;
};
