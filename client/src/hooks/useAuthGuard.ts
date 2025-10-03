import { useUserStore } from "@/store/useUserStore";

export type AuthStatus =
  | "checking"
  | "unauthenticated"
  | "unverified"
  | "authenticated"
  | "unauthorized";

export type AuthRequirements = {
  requireAuth?: boolean;
  requireVerified?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
};

export const useAuthGuard = (requirements: AuthRequirements = {}) => {
  const {
    requireAuth = false,
    requireVerified = false,
    requireAdmin = false,
    redirectTo,
  } = requirements;

  const { isAuthenticated, isCheckingAuth, user } = useUserStore();

  // Still checking authentication
  if (isCheckingAuth) {
    return { status: "checking" as const, redirect: null };
  }

  // Not authenticated but authentication is required
  if (requireAuth && !isAuthenticated) {
    return {
      status: "unauthenticated" as const,
      redirect: redirectTo || "/login",
    };
  }

  // Not verified but verification is required
  if (requireVerified && (!user?.isVerified || !user)) {
    return {
      status: "unverified" as const,
      redirect: redirectTo || "/verify-email",
    };
  }

  // Not admin but admin role is required
  if (requireAdmin && (!user?.admin || !user)) {
    return {
      status: "unauthorized" as const,
      redirect: redirectTo || "/",
    };
  }

  // All checks passed
  return { status: "authenticated" as const, redirect: null };
};
