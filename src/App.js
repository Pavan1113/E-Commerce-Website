import "./App.css";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import Dashboard from "./Dashboard/Dashboard";
import Registerform from "./Form/Registerform";
import Login from "./Form/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Brand from "./AdminDashboard/Brand";
import Partners from "./AdminDashboard/Partners";
import Collection from "./AdminDashboard/Collection";
import Products from "./AdminDashboard/Products";
import Product from "./Dashboard/Product-details";
import Cart from "./Dashboard/Cart";

function App() {
  const getAuthData = () => {
    try {
      const authData = localStorage.getItem("userAuth");
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error("Error parsing auth data:", error);
      localStorage.removeItem("userAuth");
      return null;
    }
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    const authData = getAuthData();
    return authData !== null && authData.isLoggedIn === true;
  };

  // Check if user is admin
  const isAdmin = () => {
    const authData = getAuthData();
    return authData && authData.role === 'admin';
  };

  // Auth Route - Only for non-logged in users (prevents logged in users from accessing login/register)
  const AuthRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return children;
    }
    
    // If already logged in, redirect based on role
    return isAdmin() ? <Navigate to="/admindashboard" replace /> : <Navigate to="/dashboard" replace />;
  };

  // Admin Route - Only for admin users
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <Navigate to="/Login" replace />;
    }
    
    if (!isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  // User Route - Only for regular users (non-admin)
  const UserRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <Navigate to="/Login" replace />;
    }
    
    if (isAdmin()) {
      return <Navigate to="/admindashboard" replace />;
    }
    
    return children;
  };

  return (
    <div>
      <Routes>
        {/* Public routes - only accessible when not logged in */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <Registerform />
            </AuthRoute>
          }
        />
        <Route
          path="/Login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* User-only routes - admin cannot access these */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/product-detail/:id?"
          element={
            <UserRoute>
              <Product />
            </UserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />

        {/* Admin-only routes - regular users cannot access these */}
        <Route
          path="/admindashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/brand"
          element={
            <AdminRoute>
              <Brand />
            </AdminRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <AdminRoute>
              <Partners />
            </AdminRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <AdminRoute>
              <Collection />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        {/* Catch all route - redirect based on authentication and role */}
        <Route
          path="*"
          element={
            isLoggedIn() ? (
              isAdmin() ? <Navigate to="/admindashboard" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/Login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
