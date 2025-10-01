import { type Orders } from "@/types/orderType";
import type { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = `${import.meta.env.VITE_API_URL}/api/v1/restaurant`;
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],

      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to create restaurant"
              : "Failed to create restaurant";
          toast.error(errorMessage);
          set({ loading: false });
          throw error;
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ loading: false, restaurant: response.data.restaurant });
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
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update restaurant"
              : "Failed to update restaurant";
          toast.error(errorMessage);
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
            set({
              loading: false,
              searchedRestaurant: {
                data: response.data.data || [],
              },
            });
          } else {
            throw new Error(response.data.message || "Search failed");
          }
        } catch (error) {
          set({
            loading: false,
            searchedRestaurant: {
              data: [],
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
              menus: [...(state.restaurant.menus || []), menu],
            },
          };
        });
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state) => {
          if (!state.restaurant?.menus) return state;

          const updatedMenuList = state.restaurant.menus.map((menu) =>
            menu._id === updatedMenu._id ? updatedMenu : menu
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
            set({ singleRestaurant: response.data.restaurant, loading: false });
          }
        } catch (error) {
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
        } catch (error) {
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
            toast.success(response.data.message);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update order status"
              : "Failed to update order status";
          toast.error(errorMessage);
          set({ loading: false });
          throw error;
        }
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
      }),
    }
  )
);
