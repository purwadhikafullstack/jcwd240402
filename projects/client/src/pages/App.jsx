import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "../pages/admin/AdminHome";
import AdminLoginPage from "../pages/admin/AdminLogin";
import AdminList from "../pages/admin/AdminList";
import WarehouseList from "../pages/admin/WarehouseList";
import Home from "./user/Home";
import Register from "./user/Register";
import Login from "./user/Login";
import NotifVerify from "./user/NotifVerify";
import NotifVerified from "./user/NotifVerified";
import SignUp from "./user/SignUp";
import NotifForgotPassword from "./user/NotifForgotPassword";
import ResetPassword from "./user/ResetPassword";
import NotifResetPassword from "./user/NotifResetPassword";
import NotFound from "./user/NotFound";
import NotAuth from "./user/NotAuth";
import SettingProfile from "./user/SettingProfile";
import SettingAddress from "./user/SettingAddress";
import ProductForm from "../components/ProductEdit";
import AdminCardProduct from "../components/AdminCardProduct";
import ProductList from "./Admin/ProductList";

function App() {
  return (
    <div className="App font-poppins">
      <Router>
        <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/redirect-login" element={<NotAuth />} />
          <Route path="/admin-dashboard" element={<AdminHome />} />
          <Route path="/admin/product" element={<ProductForm />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminList />} />
          <Route path="/warehouse" element={<WarehouseList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/verify" element={<NotifVerify />} />
          <Route path="/verify/:verify_token" element={<NotifVerified />} />
          <Route path="/card" element={<AdminCardProduct />} />
          <Route path="/admin/product-list" element={<ProductList />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/reset-password-success"
            element={<NotifResetPassword />}
          />
          <Route path="/forgot-password" element={<NotifForgotPassword />} />
          <Route path="/user/setting" element={<SettingProfile />} />
          <Route path="/user/setting/address" element={<SettingAddress />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
