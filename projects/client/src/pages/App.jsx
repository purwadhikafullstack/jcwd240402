import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./admin/AdminHome";
import AdminLoginPage from "./admin/AdminLogin";
import AdminList from "./admin/AdminList";
import WarehouseList from "./admin/WarehouseList";
import Home from "./user/Home";
import Register from "./user/Register";
import Login from "./user/Login";
import NotifVerify from "../components/user/notif/NotifVerify";
import NotifVerified from "../components/user/notif/NotifVerified";
import SignUp from "./user/SignUp";
import NotifForgotPassword from "../components/user/notif/NotifForgotPassword";
import ResetPassword from "./user/ResetPassword";
import NotifResetPassword from "../components/user/notif/NotifResetPassword";
import NotFound from "./user/NotFound";
import NotAuth from "./user/NotAuth";
import SettingProfile from "./user/SettingProfile";
import SettingAddress from "./user/SettingAddress";
import ProductDetail from "./user/ProductDetail";
import StockHistory from "./admin/StockHistory";
import Cart from "./user/Cart";
import CheckOut from "./user/CheckOut";
import ProductRegister from "../components/admin/product/ProductRegister";
import ProductList from "../components/admin/product/ProductList";
import AdminProductPage from "./admin/AdminProductPage";
import ProductEdit from "../components/admin/product/ProductEdit";
import CategoryList from "./admin/CategoryList";
import AdminStockPage from "./admin/AdminStockPage";
import StockList from "../components/admin/stock/StockList";
import CreateStock from "../components/admin/stock/CreateStock";
import ProductPerCategory from "./user/ProductPerCategory";
import Category from "./user/Category";
import ThisIsFurniFor from "./user/ThisIsFurniFor";
import TermAndCondition from "./user/TermAndCondition";
import PrivacyPolicy from "./user/PrivacyPolicy";
import WarehouseInputsEdit from "../components/admin/warehouse/WarehouseInputEdit";
import InventoryTransferList from "../components/admin/inventoryTransfer/InventoryTransferList";
import SettingOrder from "./user/SettingOrder";
import AllCategories from "./user/AllCategories";
import AllProducts from "./user/AllProducts";
import AllWarehouse from "./user/AllWarehouse";
import NotFoundProduct from "./user/NotFoundProduct";
import { AuthContextProvider } from "../context/AuthContext";
import AllWishlist from "./user/AllWishlist";
import PaymentFinalizing from "./user/PaymentFinalizing";
import OrderConfirmReview from "./user/OrderConfirmReview";
import UserOrder from "./admin/UserOrder";
import SalesReport from "./admin/SalesReport";
import UserList from "./admin/UserList";
import NotifVerifiedByPassword from "../components/user/notif/NotifVerifiedByPassword";

function App() {
  return (
    <div className="App font-poppins">
      <Router>
        <AuthContextProvider>
          <Routes>
            {/* ADMIN */}
            <Route path="/admin/admin-dashboard" element={<AdminHome />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/admin-list" element={<AdminList />} />
            <Route path="/admin/stock-history" element={<StockHistory />} />
            <Route path="/admin/sales-report" element={<SalesReport />} />
            <Route path="/admin/order-list" element={<UserOrder />} />
            <Route path="/admin/warehouses" element={<WarehouseList />} />
            <Route path="/admin/user-list" element={<UserList />} />

            <Route
              path="/admin/edit/:warehouseName"
              element={<WarehouseInputsEdit />}
            />

            <Route path="/admin/categories" element={<CategoryList />} />
            <Route path="/admin/products/*" element={<AdminProductPage />}>
              <Route index element={<ProductList />} />
              <Route path="create" element={<ProductRegister />} />
              <Route path="edit/:productName" element={<ProductEdit />} />
            </Route>
            <Route path="/admin/stock-list/*" element={<AdminStockPage />}>
              <Route index element={<StockList />} />
              <Route path="management" element={<CreateStock />} />
              <Route path="edit/:productName" element={<ProductEdit />} />

              <Route
                path="inventory-transfers"
                element={<InventoryTransferList />}
              />
            </Route>

            {/* HOC */}

            <Route
              path="/admin/*"
              element={
                <NotFound
                  to="/admin/admin-dashboard"
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

            {/* USER */}
            <Route path="/register" element={<Register />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/verify" element={<NotifVerify />} />
            <Route path="/verified/:verify_token" element={<NotifVerified />} />
            <Route
              path="/verify/:verify_token"
              element={<NotifVerifiedByPassword />}
            />

            <Route path="/" element={<Home />} />
            <Route path="/redirect-login" element={<NotAuth />} />
            <Route path="/user/setting" element={<SettingProfile />} />
            <Route path="/user/setting/address" element={<SettingAddress />} />
            <Route path="/user/setting/order" element={<SettingOrder />} />
            <Route path="/product/:name" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/payment/:invoiceId" element={<PaymentFinalizing />} />
            <Route
              path="/order-confirm/:invoiceId"
              element={<OrderConfirmReview />}
            />
            <Route
              path="/product/product-category/:categoryName"
              element={<ProductPerCategory />}
            />
            <Route path="/product-category" element={<Category />} />
            <Route path="/this-is-fornifor" element={<ThisIsFurniFor />} />
            <Route path="/term-and-condition" element={<TermAndCondition />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            <Route
              path="/reset-password-success"
              element={<NotifResetPassword />}
            />

            <Route path="/forgot-password" element={<NotifForgotPassword />} />
            <Route path="/all-categories" element={<AllCategories />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/all-warehouse" element={<AllWarehouse />} />
            <Route
              path="/product/not-found/:name"
              element={<NotFoundProduct />}
            />
            <Route path="/all-wishlist" element={<AllWishlist />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </div>
  );
}

export default App;
