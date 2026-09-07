import { createBrowserRouter } from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import AuthLayouts from "../layouts/AuthLaouts";
import Home from "../pages/Home/Home";
import Login from "../pages/Home/Authentication/Login/Login";
import Register from "../pages/Home/Authentication/Register/Register";
import PageNotFound from "../PageNotFound/PageNotFound";
import PrivateRoute from "../Routers/PrivateRoute";
import AdminRoute from "../Routers/AdminRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import UserManagement from "../pages/Dashboard/UserManagement/UserManagement";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ProductDetails from "../pages/Home/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayouts />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "user-management",
        element: (
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        ),
      },
      {
        path: "admin-panel",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
