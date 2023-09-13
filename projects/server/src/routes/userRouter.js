const router = require("express").Router();

const UserController = require("../controllers/userController");
const ProductController = require("../controllers/productController");
const CategoryController = require("../controllers/categoryController");
const Verify = require("../middleware/auth");
const validatorMiddleware = require("../middleware/validator/user");
const upload = require("../middleware/multer/user/imgProfile");
const addressUserCoordinate = require("../middleware/openCage/addressUserCoordinate");
const addressUserCoordinateUpdate = require("../middleware/openCage/addressUserCoordinateUpdate");
const Warehouse_stockController = require("../controllers/warehouseStockController");
const handleImageProfileUpload = require("../middleware/multer/user/imgProfile");
const WarehouseController = require("../controllers/warehouseController");
const CartController = require("../controllers/cartController");
const OrderController = require("../controllers/orderController");
const AddressController = require("../controllers/addressController");

/* AUTH */
router.post(
  "/auth/register",
  validatorMiddleware.registration,
  UserController.registerUser
);
router.get("/auth/verify/:verify_token", UserController.updateVerify);
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
router.post("/auth/register/oAuth", UserController.registerUserByEmail);

router.patch("/auth/close-account", UserController.closeAccount);

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
  addressUserCoordinateUpdate,
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

/* ORDER */

router.get(
  "/order",
  Verify.verifyAccessTokenUser,
  OrderController.getOrderList
);

router.get("/city", Verify.verifyAccessTokenUser, OrderController.getCity);

router.post(
  "/rajaongkir/cost",
  Verify.verifyAccessTokenUser,
  OrderController.getCost
);

router.get(
  "/closest",
  Verify.verifyAccessTokenUser,
  OrderController.findClosestWarehouse
);

/* WAREHOUSE */
router.get("/all-warehouse", WarehouseController.getAllWarehousesForUser);
router.post(
  "/warehouse-closest",
  Verify.verifyAccessTokenUser,
  OrderController.findClosestWarehouseByAddressId
);

module.exports = router;
