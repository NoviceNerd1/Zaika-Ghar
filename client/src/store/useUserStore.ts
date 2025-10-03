import { create } from "zustand";
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
  clearAuth: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,

  // Clear authentication state
  clearAuth: () => {
    if (import.meta.env.DEV) console.log("🔄 Clearing auth state");
    set({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      loading: false,
    });
  },

  signup: async (input: SignupInputState): Promise<SignupResult> => {
    try {
      set({ loading: true });
      if (import.meta.env.DEV) console.log("📝 Starting signup process");

      const response = await axios.post(`${API_END_POINT}/signup`, input);

      if (import.meta.env.DEV)
        console.log("✅ Signup response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        set({
          loading: false,
          user: response.data.user,
          isAuthenticated: true,
        });
        return { success: true, error: undefined, shouldRedirect: false };
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
      if (import.meta.env.DEV) console.error("❌ Signup error:", error);
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
      if (import.meta.env.DEV) console.log("🔐 Starting login process");

      const response = await axios.post(`${API_END_POINT}/login`, input);

      if (import.meta.env.DEV) console.log("✅ Login response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        set({
          loading: false,
          user: response.data.user,
          isAuthenticated: true,
        });
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("❌ Login error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      set({ loading: false });
      throw error;
    }
  },

  verifyEmail: async (verificationCode: string) => {
    try {
      set({ loading: true });
      if (import.meta.env.DEV) console.log("📧 Verifying email");

      const response = await axios.post(`${API_END_POINT}/verify-email`, {
        verificationCode,
      });

      if (import.meta.env.DEV)
        console.log("✅ Email verification response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        set({
          loading: false,
          user: response.data.user,
          isAuthenticated: true,
        });
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV)
        console.error("❌ Email verification error:", error);
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
      if (import.meta.env.DEV) console.log("🔄 Starting authentication check");
      set({ isCheckingAuth: true });

      const response = await axios.get(`${API_END_POINT}/check-auth`);

      if (import.meta.env.DEV)
        console.log("✅ Auth check response:", response.data);

      if (response.data.success && response.data.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        if (import.meta.env.DEV) console.log("🔐 Authentication successful");
      } else {
        if (import.meta.env.DEV)
          console.log("❌ Auth check failed - no user data");
        get().clearAuth();
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV)
        console.error("💥 Auth check error:", {
          message: axios.isAxiosError(error)
            ? error.response?.data?.message
            : error,
          status: axios.isAxiosError(error)
            ? error.response?.status
            : "Unknown",
        });
      get().clearAuth();
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      await axios.post(`${API_END_POINT}/logout`); // ensure backend clears cookie

      // Clear frontend state
      get().clearAuth();

      // Optional: clear all persisted states (restaurant, etc.)
      localStorage.removeItem("restaurant-store");
      localStorage.removeItem("menu-store"); // if any other store

      toast.success("Logged out successfully");
    } catch (error) {
      // Always clear state even if logout request fails
      get().clearAuth();
      localStorage.removeItem("restaurant-store");
      toast.error("Logout failed, cleared local state anyway");
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async (email: string) => {
    try {
      set({ loading: true });
      const response = await axios.post(`${API_END_POINT}/forgot-password`, {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false });
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV)
        console.error("❌ Forgot password error:", error);
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
        { newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        set({ loading: false });
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("❌ Reset password error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Password reset failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      set({ loading: false });
    }
  },

  updateProfile: async (input: UpdateProfileInput) => {
    try {
      if (import.meta.env.DEV) console.log("📝 Starting profile update");
      const response = await axios.put(
        `${API_END_POINT}/profile/update`,
        input
      );

      if (import.meta.env.DEV)
        console.log("✅ Profile update response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        // Re-fetch user data to ensure consistency
        const authResponse = await axios.get(`${API_END_POINT}/check-auth`);
        if (authResponse.data.success) {
          set({ user: authResponse.data.user, isAuthenticated: true });
        }
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("❌ Profile update error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Profile update failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      throw error;
    }
  },
}));
