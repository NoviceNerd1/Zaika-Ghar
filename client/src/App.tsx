// import Login from "./auth/Login";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Signup from "./auth/Signup";
// import ForgotPassword from "./auth/ForgotPassword";
// import ResetPassword from "./auth/ResetPassword";
// import VerifyEmail from "./auth/VerifyEmail";
// import HereSection from "./components/HereSection";
// import MainLayout from "./layout/MainLayout";
// import Profile from "./components/Profile";
// import SearchPage from "./components/SearchPage";
// import RestaurantDetail from "./components/RestaurantDetail";
// import Cart from "./components/Cart";
// import Restaurant from "./admin/Restaurant";
// import AddMenu from "./admin/AddMenu";
// import Orders from "./admin/Orders";
// import Success from "./components/Success";
// import { useUserStore } from "./store/useUserStore";
// import { Navigate } from "react-router-dom";
// import { useEffect } from "react";
// import Loading from "./components/Loading";
// import { useThemeStore } from "./store/useThemeStore";

// const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useUserStore();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user?.isVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }
//   return children;
// };

// const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, user } = useUserStore();
//   if (isAuthenticated && user?.isVerified) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isAuthenticated } = useUserStore();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   if (!user?.admin) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <MainLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       {
//         path: "/",
//         element: <HereSection />,
//       },
//       {
//         path: "/profile",
//         element: <Profile />,
//       },
//       {
//         path: "/search/:text",
//         element: <SearchPage />,
//       },
//       {
//         path: "/restaurant/:id",
//         element: <RestaurantDetail />,
//       },
//       {
//         path: "/cart",
//         element: <Cart />,
//       },
//       {
//         path: "/order/status",
//         element: <Success />,
//       },
//       // admin services start from here
//       {
//         path: "/admin/restaurant",
//         element: (
//           <AdminRoute>
//             <Restaurant />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "/admin/menu",
//         element: (
//           <AdminRoute>
//             <AddMenu />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "/admin/orders",
//         element: (
//           <AdminRoute>
//             <Orders />
//           </AdminRoute>
//         ),
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: (
//       <AuthenticatedUser>
//         <Login />
//       </AuthenticatedUser>
//     ),
//   },
//   {
//     path: "/signup",
//     element: (
//       <AuthenticatedUser>
//         <Signup />
//       </AuthenticatedUser>
//     ),
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/reset-password/:token",
//     element: <ResetPassword />,
//   },
//   {
//     path: "/verify-email/",
//     element: <VerifyEmail />,
//   },
// ]);

// function App() {
//   const initializeTheme = useThemeStore((state: any) => state.initializeTheme);
//   const { checkAuthentication, isCheckingAuth } = useUserStore();
//   // checking auth every time when page is loaded
//   useEffect(() => {
//     checkAuthentication();
//     initializeTheme();
//   }, [checkAuthentication, initializeTheme]);

//   if (isCheckingAuth) return <Loading />;
//   return (
//     <main>
//       <RouterProvider router={appRouter}></RouterProvider>
//     </main>
//   );
// }

// export default App;

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
import { useUserStore } from "./store/useUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <MainLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       {
//         path: "/",
//         element: <HereSection />,
//       },
//       {
//         path: "/profile",
//         element: <Profile />,
//       },
//       // Search routes - specific first, then parameterized
//       {
//         path: "/search",
//         element: <SearchPage />, // Shows all restaurants by default
//       },
//       {
//         path: "/search/:text",
//         element: <SearchPage />, // Shows search results
//       },
//       {
//         path: "/restaurant/:id",
//         element: <RestaurantDetail />,
//       },
//       {
//         path: "/cart",
//         element: <Cart />,
//       },
//       {
//         path: "/order/status",
//         element: <Success />,
//       },
//       // admin services start from here
//       {
//         path: "/admin/restaurant",
//         element: (
//           <AdminRoute>
//             <Restaurant />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "/admin/menu",
//         element: (
//           <AdminRoute>
//             <AddMenu />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "/admin/orders",
//         element: (
//           <AdminRoute>
//             <Orders />
//           </AdminRoute>
//         ),
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: (
//       <AuthenticatedUser>
//         <Login />
//       </AuthenticatedUser>
//     ),
//   },
//   {
//     path: "/signup",
//     element: (
//       <AuthenticatedUser>
//         <Signup />
//       </AuthenticatedUser>
//     ),
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/reset-password/:token",
//     element: <ResetPassword />,
//   },
//   {
//     path: "/verify-email/",
//     element: <VerifyEmail />,
//   },
// ]);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // MainLayout stays public
    children: [
      // Public routes
      {
        path: "/",
        element: <HereSection />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/search/:text",
        element: <SearchPage />,
      },
      {
        path: "/restaurant/:id",
        element: <RestaurantDetail />, // restaurant details page
      },
      {
        path: "/restaurant/:id/menu",
        element: <RestaurantDetail />, // (if you have separate menu route)
      },

      // Protected (require login)
      {
        path: "/profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/order/status",
        element: (
          <ProtectedRoutes>
            <Success />
          </ProtectedRoutes>
        ),
      },

      // Admin
      {
        path: "/admin/restaurant",
        element: (
          <AdminRoute>
            <Restaurant />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/menu",
        element: (
          <AdminRoute>
            <AddMenu />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
    ],
  },

  // Auth pages
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email/",
    element: <VerifyEmail />,
  },
]);

function App() {
  const initializeTheme = useThemeStore((state: any) => state.initializeTheme);
  const { checkAuthentication, isCheckingAuth } = useUserStore();
  // checking auth every time when page is loaded
  useEffect(() => {
    checkAuthentication();
    initializeTheme();
  }, [checkAuthentication, initializeTheme]);

  if (isCheckingAuth) return <Loading />;
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
