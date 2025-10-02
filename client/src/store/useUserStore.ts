import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import type { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = `${import.meta.env.VITE_API_URL}/api/v1/user`;
axios.defaults.withCredentials = true;

type User = {
  fullname: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
};

type UpdateProfileInput = Partial<Omit<User, "admin" | "isVerified">>;

type SignupResult = {
  success: boolean;
  error?: string;
  shouldRedirect?: boolean;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<SignupResult>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  clearAuth: () => void; // New method to clear auth state
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,

      // Clear authentication state
      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      },

      signup: async (input: SignupInputState): Promise<SignupResult> => {
        try {
          set({ loading: true });

          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
            return { success: true };
          } else {
            const errorMessage = response.data.message || "Signup failed";
            toast.error(errorMessage);
            set({ loading: false });
            return {
              success: false,
              error: errorMessage,
              shouldRedirect: false,
            };
          }
        } catch (error: unknown) {
          let errorMessage = "An unexpected error occurred";
          let shouldRedirect = false;

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || "Signup failed";
            if (errorMessage.toLowerCase().includes("already exist")) {
              shouldRedirect = true;
            }
            toast.error(errorMessage);
          } else {
            toast.error(errorMessage);
          }

          set({ loading: false });
          return { success: false, error: errorMessage, shouldRedirect };
        }
      },

      login: async (input: LoginInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Login failed");
          } else {
            toast.error("An unexpected error occurred");
          }
          set({ loading: false });
          throw error; // Re-throw to handle in component
        }
      },

      verifyEmail: async (verificationCode: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Email verification failed"
            );
          } else {
            toast.error("An unexpected error occurred");
          }
          set({ loading: false });
          throw error;
        }
      },

      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const response = await axios.get(`${API_END_POINT}/check-auth`, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          } else {
            get().clearAuth();
          }
        } catch (error: unknown) {
          console.error("Authentication check failed:", error);
          get().clearAuth();
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/logout`,
            {},
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            get().clearAuth();
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Logout failed");
          } else {
            toast.error("An unexpected error occurred");
          }
          set({ loading: false });
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email },
            { withCredentials: true }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Password reset request failed"
            );
          } else {
            toast.error("An unexpected error occurred");
          }
          set({ loading: false });
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword },
            { withCredentials: true }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Password reset failed"
            );
          } else {
            toast.error("An unexpected error occurred");
          }
          set({ loading: false });
        }
      },

      updateProfile: async (input: UpdateProfileInput) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            input,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Profile update failed"
            );
          } else {
            toast.error("An unexpected error occurred");
          }
          throw error;
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not auth state
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
