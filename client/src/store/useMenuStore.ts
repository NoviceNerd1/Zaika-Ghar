import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";
import { type MenuItem } from "@/types/restaurantType";

const API_END_POINT = `${import.meta.env.VITE_API_URL}/api/v1/menu`;
axios.defaults.withCredentials = true;

type MenuState = {
  loading: boolean;
  menu: MenuItem | null;
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
  removeMenu: (menuId: string) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: null,
      createMenu: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu });

            // Update restaurant store with the new menu
            useRestaurantStore
              .getState()
              .addMenuToRestaurant(response.data.menu);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to create menu"
              : "Failed to create menu";

          toast.error(errorMessage);
          set({ loading: false });
        }
      },

      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/${menuId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu });

            // Update restaurant store with the updated menu
            useRestaurantStore
              .getState()
              .updateMenuToRestaurant(response.data.menu);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update menu"
              : "Failed to update menu";

          toast.error(errorMessage);
          set({ loading: false });
        }
      },

      removeMenu: async (menuId: string) => {
        try {
          set({ loading: true });
          const response = await axios.delete(`${API_END_POINT}/${menuId}`);

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: null });

            // Update restaurant store by removing the menu
            // Note: You might need to implement removeMenuFromRestaurant in useRestaurantStore
            // useRestaurantStore.getState().removeMenuFromRestaurant(menuId);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to delete menu"
              : "Failed to delete menu";

          toast.error(errorMessage);
          set({ loading: false });
        }
      },
    }),
    {
      name: "menu-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        menu: state.menu,
      }),
    }
  )
);
