// stores/useRestaurantStore.ts
import { type Orders } from "@/types/orderType";
import type {
  MenuItem,
  Restaurant,
  RestaurantState,
} from "@/types/restaurantType";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = `${import.meta.env.VITE_API_URL}/api/v1/restaurant`;
axios.defaults.withCredentials = true;

// Enhanced toast notifications with visual styling
const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
    },
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      border: "1px solid hsl(var(--destructive))",
    },
  });
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],
      theme: "light", // Default theme
      viewMode: "grid", // Default view mode

      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            showSuccessToast(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to create restaurant"
              : "Failed to create restaurant";
          showErrorToast(errorMessage);
          set({ loading: false });
          throw error;
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({
              loading: false,
              restaurant: {
                ...response.data.restaurant,
                // Ensure all visual properties exist
                rating: response.data.restaurant.rating || 4.0,
                location:
                  response.data.restaurant.location ||
                  `${response.data.restaurant.city}, ${response.data.restaurant.country}`,
                cost: response.data.restaurant.cost || 500,
              },
            });
          }
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response?.status === 404) {
            set({ restaurant: null });
          }
          set({ loading: false });
        }
      },

      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            showSuccessToast(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update restaurant"
              : "Failed to update restaurant";
          showErrorToast(errorMessage);
          set({ loading: false });
          throw error;
        }
      },

      searchRestaurant: async (
        searchText: string = "",
        searchQuery: string = "",
        selectedCuisines?: string[]
      ) => {
        try {
          set({ loading: true });

          const params = new URLSearchParams();

          if (searchQuery.trim()) {
            params.set("searchQuery", searchQuery);
          }

          if (selectedCuisines && selectedCuisines.length > 0) {
            params.set("selectedCuisines", selectedCuisines.join(","));
          }

          const endpoint = searchText.trim()
            ? `${API_END_POINT}/search/${searchText}`
            : `${API_END_POINT}/search/all`;

          const url = params.toString()
            ? `${endpoint}?${params.toString()}`
            : endpoint;

          const response = await axios.get(url);

          if (response.data.success) {
            // Enhance restaurant data with visual properties
            const enhancedData = (response.data.data || []).map(
              (restaurant: Restaurant) => ({
                ...restaurant,
                rating: restaurant.rating || Math.random() * 2 + 3.5, // Default rating if none
                location:
                  restaurant.location ||
                  `${restaurant.city}, ${restaurant.country}`,
                cost: restaurant.cost || Math.floor(Math.random() * 500) + 200, // Default cost
              })
            );

            set({
              loading: false,
              searchedRestaurant: {
                data: enhancedData,
                totalCount: response.data.totalCount,
                hasMore: response.data.hasMore,
              },
            });
          } else {
            throw new Error(response.data.message || "Search failed");
          }
        } catch (error: unknown) {
          console.error("Restaurant search failed:", error);
          set({
            loading: false,
            searchedRestaurant: {
              data: [],
              totalCount: 0,
              hasMore: false,
            },
          });
        }
      },

      addMenuToRestaurant: (menu: MenuItem) => {
        set((state) => {
          if (!state.restaurant) return state;

          return {
            restaurant: {
              ...state.restaurant,
              menus: [
                ...(state.restaurant.menus || []),
                {
                  ...menu,
                  isAvailable: menu.isAvailable ?? true,
                  category: menu.category || "Main Course",
                },
              ],
            },
          };
        });
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state) => {
          if (!state.restaurant?.menus) return state;

          const updatedMenuList = state.restaurant.menus.map((menu) =>
            menu._id === updatedMenu._id
              ? {
                  ...updatedMenu,
                  isAvailable: updatedMenu.isAvailable ?? true,
                  category: updatedMenu.category || "Main Course",
                }
              : menu
          );

          return {
            restaurant: {
              ...state.restaurant,
              menus: updatedMenuList,
            },
          };
        });
      },

      removeMenuFromRestaurant: (menuId: string) => {
        set((state) => {
          if (!state.restaurant?.menus) return state;

          const updatedMenuList = state.restaurant.menus.filter(
            (menu) => menu._id !== menuId
          );

          return {
            restaurant: {
              ...state.restaurant,
              menus: updatedMenuList,
            },
          };
        });
      },

      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];

          return { appliedFilter: updatedFilter };
        });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      getSingleRestaurant: async (restaurantId: string) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            const restaurantData = response.data.restaurant;
            set({
              singleRestaurant: {
                ...restaurantData,
                rating: restaurantData.rating || 4.0,
                location:
                  restaurantData.location ||
                  `${restaurantData.city}, ${restaurantData.country}`,
                cost: restaurantData.cost || 500,
                contact: restaurantData.contact || "+91 XXXXXXXXXX",
                openingHours:
                  restaurantData.openingHours || "10:00 AM - 10:00 PM",
              },
              loading: false,
            });
          }
        } catch (error: unknown) {
          console.error("Restaurant search failed:", error);
          set({ loading: false, singleRestaurant: null });
        }
      },

      getRestaurantOrders: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrder: response.data.orders, loading: false });
          }
        } catch (error: unknown) {
          console.error("Restaurant order search failed:", error);
          set({ loading: false, restaurantOrder: [] });
        }
      },

      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            const updatedOrders = get().restaurantOrder.map((order: Orders) =>
              order._id === orderId
                ? { ...order, status: response.data.status }
                : order
            );

            set({ restaurantOrder: updatedOrders, loading: false });
            showSuccessToast(response.data.message);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update order status"
              : "Failed to update order status";
          showErrorToast(errorMessage);
          set({ loading: false });
          throw error;
        }
      },

      // Visual enhancement methods
      setTheme: (theme: "light" | "dark") => {
        set({ theme });
        // Apply theme to document
        document.documentElement.classList.toggle("dark", theme === "dark");
      },

      setViewMode: (mode: "grid" | "list") => {
        set({ viewMode: mode });
      },

      clearSearchedRestaurant: () => {
        set({ searchedRestaurant: null });
      },

      clearSingleRestaurant: () => {
        set({ singleRestaurant: null });
      },

      clearRestaurantOrders: () => {
        set({ restaurantOrder: [] });
      },
    }),
    {
      name: "restaurant-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        restaurant: state.restaurant,
        appliedFilter: state.appliedFilter,
        theme: state.theme,
        viewMode: state.viewMode,
      }),
    }
  )
);
