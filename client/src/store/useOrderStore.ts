// import type { CheckoutSessionRequest, OrderState } from "@/types/orderType";
// import axios from "axios";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import { useUserStore } from "@/store/useUserStore";

// const API_END_POINT: string = `${import.meta.env.VITE_API_URL}/api/v1/order`;
// axios.defaults.withCredentials = true;

// export const useOrderStore = create<OrderState>()(
//   persist(
//     (set, get) => ({
//       loading: false,
//       orders: [],

//       createCheckoutSession: async (
//         checkoutSession: CheckoutSessionRequest
//       ) => {
//         try {
//           set({ loading: true });

//           const token = useUserStore.getState().token;

//           const response = await axios.post(
//             `${API_END_POINT}/checkout/create-checkout-session`,
//             checkoutSession,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`, // <-- Add this
//               },
//               withCredentials: true, // ensure cookies are sent if needed
//             }
//           );

//           if (response.data.session?.url) {
//             window.location.href = response.data.session.url;
//           } else {
//             console.error("No session URL received from server");
//           }

//           set({ loading: false });
//         } catch (error: unknown) {
//           console.error("Checkout session creation failed:", error);
//           set({ loading: false });
//           throw error; // Re-throw to allow component-level error handling
//         }
//       },

//       getOrderDetails: async () => {
//         try {
//           set({ loading: true });
//           const response = await axios.get(`${API_END_POINT}/`);

//           if (response.data.orders) {
//             set({ loading: false, orders: response.data.orders });
//           } else {
//             console.warn("No orders data received from server");
//             set({ loading: false, orders: [] });
//           }
//         } catch (error: unknown) {
//           console.error("Failed to fetch order details:", error);
//           set({ loading: false, orders: [] });
//         }
//       },

//       // Safe utility methods that don't rely on createdAt
//       clearOrders: () => {
//         set({ orders: [] });
//       },

//       getOrderById: (orderId: string) => {
//         const state = get();
//         return state.orders.find((order) => order._id === orderId);
//       },
//     }),
//     {
//       name: "order-store",
//       storage: createJSONStorage(() => localStorage),
//       // Only persist orders data, not loading state
//       partialize: (state) => ({
//         orders: state.orders,
//       }),
//     }
//   )
// );

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
        } catch (error: any) {
          console.error("Checkout session creation failed:", error);
          console.error("Error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
          });
          set({ loading: false });
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
