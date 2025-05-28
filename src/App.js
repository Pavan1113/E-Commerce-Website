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
import Payment from "./Dashboard/Payment";
import OrdersList from "./Dashboard/OrdersList";
import Payments from "./Dashboard/Payments";

function App() {

   const AuthRoute = ({ children }) => {
     const login = localStorage.getItem("logedInUser");
     return !login ? children : <Navigate to="/dashboard" />;
   };

   const ProtectedRoute = ({ children }) => {
     const login = localStorage.getItem("logedInUser");
     return login ? children : <Navigate to="/Login" />;
   };

  return (
    <div>
       {/* <Button text={'Submit'} onClick={handleChange} style={{backgroundColor : name ? "red" : "blue", border: '1px solid red'}} name={name} /> */}
      <Routes>
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
              </ProtectedRoute>
          }
        />
      <Route path="/brand" element={<Brand />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product-detail" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />}/>
      <Route path="/order" element={<OrdersList />}/>
      <Route path="/payments" element={<Payments />}/>
      </Routes>

    </div>
  );
}

export default App;
