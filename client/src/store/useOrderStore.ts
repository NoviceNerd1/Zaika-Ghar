import type { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT: string = `${import.meta.env.VITE_API_URL}/api/v1/order`;
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      loading: false,
      orders: [],

      createCheckoutSession: async (
        checkoutSession: CheckoutSessionRequest
      ) => {
        try {
          set({ loading: true });

          console.log(
            "Sending request to:",
            `${API_END_POINT}/checkout/create-checkout-session`
          );
          console.log("Request data:", checkoutSession);

          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          console.log("Response received:", response.data);

          if (response.data.session?.url) {
            window.location.href = response.data.session.url;
          } else {
            console.error("No session URL received from server");
            throw new Error("No session URL received");
          }

          set({ loading: false });
        } catch (error: unknown) {
          set({ loading: false });

          if (axios.isAxiosError(error)) {
            console.error("Checkout session creation failed:", {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              url: error.config?.url,
            });
          } else if (error instanceof Error) {
            console.error("Checkout session creation failed:", error.message);
          } else {
            console.error("Checkout session creation failed:", error);
          }
          throw error;
        }
      },

      getOrderDetails: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);

          if (response.data.orders) {
            set({ loading: false, orders: response.data.orders });
          } else {
            console.warn("No orders data received from server");
            set({ loading: false, orders: [] });
          }
        } catch (error: unknown) {
          console.error("Failed to fetch order details:", error);
          set({ loading: false, orders: [] });
        }
      },

      clearOrders: () => {
        set({ orders: [] });
      },

      getOrderById: (orderId: string) => {
        const state = get();
        return state.orders.find((order) => order._id === orderId);
      },
    }),
    {
      name: "order-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);
