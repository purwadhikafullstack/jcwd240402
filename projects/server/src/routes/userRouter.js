const router = require("express").Router();

const UserController = require("../controllers/userController");
const ProductController = require("../controllers/productController");
const CategoryController = require("../controllers/categoryController");
const Verify = require("../middleware/auth");
const validatorMiddleware = require("../middleware/validator/user");

const addressUserCoordinate = require("../middleware/openCage/addressUserCoordinate");
const Warehouse_stockController = require("../controllers/warehouseStockController");
const handleImageProfileUpload = require("../middleware/multer/user/imgProfile");
const handlePaymentProofUpload = require("../middleware/multer/user/imgPayment");
const WarehouseController = require("../controllers/warehouseController");
const CartController = require("../controllers/cartController");
const OrderController = require("../controllers/orderController");
const AddressController = require("../controllers/addressUserController");
const WishlistController = require("../controllers/wishlistController");

/* AUTH */
router.post(
  "/auth/register",
  validatorMiddleware.registration,
  UserController.registerUser
);

router.post(
  "/auth/verify/:verify_token",
  UserController.updateVerifyByPassword
);
router.post("/auth/login", validatorMiddleware.login, UserController.login);
router.get(
  "/auth/keep-login",
  Verify.verifyRefreshToken,
  UserController.keepLogin
);
router.post(
  "/auth/resend-verify",
  Verify.verifyAccessTokenUser,
  validatorMiddleware.emailInput,
  UserController.resendVerifyAccount
);
router.post(
  "/auth/forgot-password",
  validatorMiddleware.emailInput,
  UserController.forgotPassword
);
router.patch(
  "/auth/reset-password/:resetToken",
  validatorMiddleware.resetPassword,
  UserController.resetPassword
);
router.post(
  "/auth/register/oAuth",
  validatorMiddleware.registrationByOAuth,
  UserController.registerUserByEmail
);
router.post(
  "/auth/login/oAuth",
  validatorMiddleware.loginByOAuth,
  UserController.loginByEmail
);

/* PROFILING USER */

router.get(
  "/profile",
  Verify.verifyAccessTokenUser,
  UserController.userInformation
);

router.patch(
  "/profile",
  Verify.verifyAccessTokenUser,
  handleImageProfileUpload,
  validatorMiddleware.updateProfile,
  UserController.updateUserInformation
);

/* PROFILING USER ADDRESS */

router.post(
  "/profile/address",
  Verify.verifyAccessTokenUser,
  validatorMiddleware.registerAddress,
  addressUserCoordinate,
  AddressController.registerAddress
);

router.get(
  "/profile/address",
  Verify.verifyAccessTokenUser,
  AddressController.userAddress
);

router.patch(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  handleImageProfileUpload,
  addressUserCoordinate,
  AddressController.changeAddress
);

router.patch(
  "/profile/address/primary/:address_id",
  Verify.verifyAccessTokenUser,
  AddressController.changePrimaryAddress
);

router.delete(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  AddressController.deleteAddress
);

router.get(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  AddressController.getAddressById
);

/* REGION QUERY */

router.get("/region-city", AddressController.regionUserForCity);
router.get("/region-province", AddressController.regionUserForProvince);

/* PRODUCT */
router.get("/product/:name", ProductController.getProductByProductName);
router.get("/products", ProductController.getAllProductForSearchSuggestion);
router.get("/products-per-category", ProductController.getProductPerCategory);
router.get(
  "/products/category",
  ProductController.getAllProductCategoryWithParanoid
);

/* CATEGORY */
router.get("/category", CategoryController.getAllCategory);
router.get("/paranoid-category", CategoryController.getAllCategoryWithParanoid);

/* WAREHOUSE STOCK */

router.get(
  "/warehouse-stock/filter",
  Warehouse_stockController.getAllWarehouseStockFilter
);

router.get(
  "/warehouse-stock/product/:name",
  Warehouse_stockController.getProductStockByProductName
);

/* CART */
router.post(
  "/cart",
  Verify.verifyAccessTokenUser,
  validatorMiddleware.addToCart,
  CartController.addToCart
);

router.get("/cart", Verify.verifyAccessTokenUser, CartController.getUserCart);

router.delete(
  "/cart/:productName",
  Verify.verifyAccessTokenUser,
  CartController.cancelCart
);

router.patch(
  "/cart",
  Verify.verifyAccessTokenUser,
  validatorMiddleware.addToCart,
  CartController.updateCart
);

router.delete(
  "/cart-order",
  Verify.verifyAccessTokenUser,
  CartController.cancelCartListWhenOrder
);

/* ORDER */

router.get(
  "/order",
  Verify.verifyAccessTokenUser,
  OrderController.getOrderList
);

router.get(
  "/order-scroll",
  Verify.verifyAccessTokenUser,
  OrderController.getOrderListInfiniteScroll
);

router.get(
  "/order/:invoiceId",
  Verify.verifyAccessTokenUser,
  OrderController.getCurrentOrderList
);

router.post(
  "/order-status",
  Verify.verifyAccessTokenUser,
  OrderController.changeOrderStatus
);

router.get("/city", Verify.verifyAccessTokenUser, OrderController.getCity);

router.post(
  "/rajaongkir/cost",
  Verify.verifyAccessTokenUser,
  OrderController.getCost
);

router.post(
  "/closest",
  Verify.verifyAccessTokenUser,
  OrderController.findClosestWarehouseByAddressId
);

router.post(
  "/check-out",
  Verify.verifyAccessTokenUser,
  OrderController.createNewOrder
);

router.post(
  "/check-out-details",
  Verify.verifyAccessTokenUser,
  OrderController.createNewOrderDetails
);

router.patch(
  "/payment-proof/:id",
  Verify.verifyAccessTokenUser,
  handlePaymentProofUpload,
  OrderController.uploadPaymentProof
);

router.delete(
  "/reserved-order/:orderId",
  Verify.verifyAccessTokenUser,
  OrderController.cancelOrderToDeleteReservedStock
);

/* WAREHOUSE */
router.get("/all-warehouse", WarehouseController.getAllWarehousesForUser);
router.post(
  "/warehouse-closest",
  Verify.verifyAccessTokenUser,
  OrderController.findClosestWarehouseByAddressId
);

/* WISHLIST */
router.post(
  "/wishlist/:product",
  Verify.verifyAccessTokenUser,
  WishlistController.addWishlist
);
router.delete(
  "/wishlist/:product",
  Verify.verifyAccessTokenUser,
  WishlistController.cancelWishlist
);
router.get(
  "/wishlist",
  Verify.verifyAccessTokenUser,
  WishlistController.getAllWishlist
);

router.get(
  "/show-wishlist",
  Verify.verifyAccessTokenUser,
  WishlistController.getAllWishlistInfiniteScroll
);
router.get(
  "/wishlist/:product",
  Verify.verifyAccessTokenUser,
  WishlistController.getUserWishlistSpecificProduct
);

module.exports = router;
