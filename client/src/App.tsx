import Login from "./auth/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import HereSection from "./components/HereSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";

// Enhanced ProtectedRoutes with redirect back after login
const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isCheckingAuth } = useUserStore();
  const location = useLocation();

  // Show loading while checking auth to prevent flash
  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

// Enhanced AuthenticatedUser for auth pages
const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isCheckingAuth } = useUserStore();
  const location = useLocation();

  // Show loading while checking auth
  if (isCheckingAuth) {
    return <Loading />;
  }

  // If authenticated and verified, redirect to intended page or home
  if (isAuthenticated && user?.isVerified) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // If authenticated but not verified, allow access to verify-email page
  if (
    isAuthenticated &&
    !user?.isVerified &&
    location.pathname !== "/verify-email"
  ) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

// Enhanced AdminRoute
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isCheckingAuth } = useUserStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Optimized router configuration
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: <HereSection />,
      },
      {
        path: "search/:text", // More specific first
        element: <SearchPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "restaurant/:id",
        element: <RestaurantDetail />,
      },
      // Remove duplicate /restaurant/:id/menu unless you need it

      // Protected routes (require login + verification)
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>
        ),
      },
      {
        path: "order/status",
        element: (
          <ProtectedRoutes>
            <Success />
          </ProtectedRoutes>
        ),
      },

      // Admin routes (require login + verification + admin role)
      {
        path: "admin/restaurant",
        element: (
          <AdminRoute>
            <Restaurant />
          </AdminRoute>
        ),
      },
      {
        path: "admin/menu",
        element: (
          <AdminRoute>
            <AddMenu />
          </AdminRoute>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },

      // 404 catch-all - keep at bottom
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },

  // Auth pages (redirect if already authenticated)
  {
    path: "/login",
    element: (
      <AuthenticatedUser>
        <Login />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthenticatedUser>
        <Signup />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <AuthenticatedUser>
        <VerifyEmail />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const { checkAuthentication, isCheckingAuth } = useUserStore();

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([checkAuthentication(), initializeTheme()]);
    };

    initializeApp();
  }, [checkAuthentication, initializeTheme]);

  // Global loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
