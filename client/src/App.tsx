import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import NotFound from "./components/NotFound";
import { useUserStore } from "./store/useUserStore";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";
import { RouteGuard } from "./auth/RouteGuard";

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
        path: "search/:text",
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

      // Protected routes (require login + verification)
      {
        path: "profile",
        element: (
          <RouteGuard
            requirements={{ requireAuth: true, requireVerified: true }}
          >
            <Profile />
          </RouteGuard>
        ),
      },
      {
        path: "cart",
        element: (
          <RouteGuard
            requirements={{ requireAuth: true, requireVerified: true }}
          >
            <Cart />
          </RouteGuard>
        ),
      },
      {
        path: "order/status",
        element: (
          <RouteGuard
            requirements={{ requireAuth: true, requireVerified: true }}
          >
            <Success />
          </RouteGuard>
        ),
      },

      // Admin routes (require login + verification + admin role)
      {
        path: "admin/restaurant",
        element: (
          <RouteGuard
            requirements={{
              requireAuth: true,
              requireVerified: true,
              requireAdmin: true,
            }}
          >
            <Restaurant />
          </RouteGuard>
        ),
      },
      {
        path: "admin/menu",
        element: (
          <RouteGuard
            requirements={{
              requireAuth: true,
              requireVerified: true,
              requireAdmin: true,
            }}
          >
            <AddMenu />
          </RouteGuard>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <RouteGuard
            requirements={{
              requireAuth: true,
              requireVerified: true,
              requireAdmin: true,
            }}
          >
            <Orders />
          </RouteGuard>
        ),
      },

      // 404 page - much better UX
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Auth pages (redirect if already authenticated + verified)
  {
    path: "/login",
    element: (
      <RouteGuard
        requirements={{
          requireAuth: false,
          redirectTo: "/",
        }}
      >
        <Login />
      </RouteGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <RouteGuard
        requirements={{
          requireAuth: false,
          redirectTo: "/",
        }}
      >
        <Signup />
      </RouteGuard>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <RouteGuard
        requirements={{
          requireAuth: true,
          requireVerified: false, // Allow access to verification page
          redirectTo: "/",
        }}
      >
        <VerifyEmail />
      </RouteGuard>
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
  const {
    checkAuthentication,
    isCheckingAuth,
    resetLogoutFlag,
    justLoggedOut,
  } = useUserStore();
  const [initError, setInitError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 🔧 SAFETY NET: Reset logout flag on app start to prevent stuck state
  useEffect(() => {
    const setupLogoutSafetyNet = () => {
      // If we have a logout flag set, reset it after a timeout
      // This prevents the app from being permanently "logged out" after abnormal shutdowns
      if (justLoggedOut) {
        const safetyTimeout = setTimeout(() => {
          if (import.meta.env.DEV) {
            console.log("🛡️ Safety net: Resetting logout flag");
          }
          resetLogoutFlag();
        }, 10000); // Reset after 10 seconds as safety net

        return () => clearTimeout(safetyTimeout);
      }
    };

    setupLogoutSafetyNet();
  }, [justLoggedOut, resetLogoutFlag]);

  // 🚀 Initialize app on mount - with enhanced error handling
  useEffect(() => {
    const initializeApp = async () => {
      // Prevent multiple initializations
      if (initialized) return;

      try {
        setInitError(null);

        if (import.meta.env.DEV) {
          console.log("🎬 Starting app initialization...", {
            justLoggedOut,
            isCheckingAuth,
          });
        }

        // Initialize theme first (non-blocking, visual feedback)
        initializeTheme();

        // 🔑 CRITICAL: Check authentication (respects justLoggedOut flag)
        await checkAuthentication();

        setInitialized(true);

        if (import.meta.env.DEV) {
          console.log("✅ App initialization complete");
        }
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        setInitError(
          error instanceof Error
            ? error.message
            : "Failed to initialize application"
        );
        setInitialized(true); // Mark as initialized even on error
      }
    };

    initializeApp();
  }, [checkAuthentication, initializeTheme, initialized, justLoggedOut]);

  // 🎯 Enhanced initialization states with better UX
  const getLoadingMessage = () => {
    if (justLoggedOut) {
      return "Completing logout...";
    }
    return "Loading your experience...";
  };

  const getLoadingSubtext = () => {
    if (justLoggedOut) {
      return "Please wait while we secure your session";
    }
    return "Preparing everything for you";
  };

  // 🚨 Show initialization error
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Unable to Load Application
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {initError}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
            <button
              onClick={() => {
                // Clear all storage and retry
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear & Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⏳ Global loading state - show loading while checking initial auth
  if (isCheckingAuth && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center max-w-sm">
          <div className="relative mb-8">
            <Loading />
            <div
              className={`absolute inset-0 rounded-full blur-lg opacity-30 animate-pulse ${
                justLoggedOut
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : "bg-gradient-to-r from-orange-400 to-red-500"
              }`}
            ></div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
              {getLoadingMessage()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getLoadingSubtext()}
            </p>
            <div
              className={`w-32 h-1 rounded-full mx-auto animate-pulse ${
                justLoggedOut
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : "bg-gradient-to-r from-orange-400 to-red-500"
              }`}
            ></div>
          </div>

          {/* 🔧 Debug info in development */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
              <div>justLoggedOut: {justLoggedOut.toString()}</div>
              <div>isCheckingAuth: {isCheckingAuth.toString()}</div>
              <div>initialized: {initialized.toString()}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🎉 Main app render
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
