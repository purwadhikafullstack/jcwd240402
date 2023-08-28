import "./App.css";
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
=======
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
>>>>>>> 2afc9de9afca00ff7751b7e55d8f5be4b3a69ae3
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
<<<<<<< HEAD
import SettingProfile from "./user/SettingProfile";
import SettingAddress from "./user/SettingAddress";
import ProductDetail from "./user/ProductDetail";
// import AdminProductDetail from "./admin/AdminList";
import Cart from "./user/Cart";
import CheckOut from "./user/CheckOut";
import ProductRegister from "../components/Product/ProductRegister";
import ProductList from "../components/Product/ProductList";
import AdminProductPage from "./admin/AdminProductPage";
import ProductEdit from "../components/Product/ProductEdit";
import CategoryList from "./admin/CategoryList";
import AdminStockPage from "./admin/AdminStockPage";
import StockList from "../components/stock/StockList";
import CreateStock from "../components/stock/CreateStock";
import ProductPerCategory from "./user/ProductPerCategory";
import Category from "./user/Category";
=======
import ProductRegister from "../components/admin/product/ProductRegister";
import ProductList from "../components/admin/product/ProductList";
import AdminProductPage from "./admin/AdminProductPage";
import ProductEdit from "../components/admin/product/ProductEdit"
import CategoryList from "./admin/CategoryList";
import AdminStockPage from "./admin/AdminStockPage";
import StockList from "../components/admin/stock/StockList";
import CreateStock from "../components/admin/stock/CreateStock";
import SettingProfile from "./user/SettingProfile";
import SettingAddress from "./user/SettingAddress";
import ProductDetail from "./user/ProductDetail";

import Cart from "./user/Cart";
import CheckOut from "./user/CheckOut";
>>>>>>> 2afc9de9afca00ff7751b7e55d8f5be4b3a69ae3

function App() {
  return (
    <div className="App font-poppins">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/redirect-login" element={<NotAuth />} />
          <Route path="/admin-dashboard" element={<AdminHome />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminList />} />
          <Route path="/warehouse" element={<WarehouseList />} /> {/* admin */}
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/verify" element={<NotifVerify />} />
          <Route path="/verify/:verify_token" element={<NotifVerified />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/reset-password-success"
            element={<NotifResetPassword />}
          />
          <Route path="/forgot-password" element={<NotifForgotPassword />} />
<<<<<<< HEAD
          <Route path="/category" element={<CategoryList />} /> {/* admin */}
=======
          <Route path="/user/setting" element={<SettingProfile />} />
          <Route path="/user/setting/address" element={<SettingAddress />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/category" element={<CategoryList/>} />

>>>>>>> 2afc9de9afca00ff7751b7e55d8f5be4b3a69ae3
          <Route path="/admin/products/*" element={<AdminProductPage />}>
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductRegister />} />{" "}
            {/* admin dan pathnya di lengkapi*/}
            <Route path="edit/:productName" element={<ProductEdit />} />{" "}
            {/* admin dan pathnya di lengkapi*/}
          </Route>
          <Route path="/admin/stock/*" element={<AdminStockPage />}>
            <Route index element={<StockList />} />
            <Route path="management" element={<CreateStock />} />
            <Route path="edit/:productName" element={<ProductEdit />} />
<<<<<<< HEAD
          </Route>{" "}
          {/* admin dan pathnya di perbaiki*/}
          {/* 404 */}
          <Route
            path="/admin/*"
            element={
              <NotFound
                to="/admin/stock"
                buttonText="back"
                toPage="dashboard"
              />
            }
          />
          <Route
            path="/*"
            element={
              <NotFound to="/" buttonText="go home" toPage="home page" />
            }
          />
          <Route path="/user/setting" element={<SettingProfile />} />
          <Route path="/user/setting/address" element={<SettingAddress />} />
          <Route path="/product/:name" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route
            path="/product/product-category/:categoryName"
            element={<ProductPerCategory />}
          />
          <Route path="/product-category" element={<Category />} />
=======
          </Route>



          <Route path="/*" element={<NotFound />} />
>>>>>>> 2afc9de9afca00ff7751b7e55d8f5be4b3a69ae3
        </Routes>
      </Router>
    </div>
  );
}

export default App;
