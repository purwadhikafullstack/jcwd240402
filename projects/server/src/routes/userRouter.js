const router = require("express").Router();

const UserController = require("../controllers/userController");
const ProductController = require("../controllers/productController");
const CategoryController = require("../controllers/categoryController");
const Verify = require("../middleware/auth");
const validatorMiddleware = require("../middleware/validator/user");
const upload = require("../middleware/multer/user/imgProfile");
const addressUserCoordinate = require("../middleware/openCage/addressUserCoordinate");
const addressUserCoordinateUpdate = require("../middleware/openCage/addressUserCoordinateUpdate");
const Warehouse_stockController = require("../controllers/warehouse_stockController");
const handleImageProfileUpload = require("../middleware/multer/user/imgProfile");

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
  UserController.registerAddress
);

router.get(
  "/profile/address",
  Verify.verifyAccessTokenUser,
  UserController.userAddress
);

router.patch(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  handleImageProfileUpload,
  addressUserCoordinateUpdate,
  UserController.changeAddress
);

router.patch(
  "/profile/address/primary/:address_id",
  Verify.verifyAccessTokenUser,
  UserController.changePrimaryAddress
);

router.delete(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  UserController.deleteAddress
);

router.get(
  "/profile/address/:address_id",
  Verify.verifyAccessTokenUser,
  UserController.getAddressById
);

/* REGION QUERY */

router.get("/region-city", UserController.regionUserForCity);
router.get("/region-province", UserController.regionUserForProvince);

/* PRODUCT */
router.get("/product/:name", ProductController.getProductByProductName);
router.get("/products", ProductController.getAllProductForSearchSuggestion);
router.get("/products-per-category", ProductController.getProductPerCategory);

/* CATEGORY */
router.get("/category", CategoryController.getAllCategory);

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
  UserController.addToCart
);

router.get("/cart", Verify.verifyAccessTokenUser, UserController.getUserCart);

router.delete(
  "/cart/:productName",
  Verify.verifyAccessTokenUser,
  UserController.cancelCart
);

router.patch(
  "/cart",
  Verify.verifyAccessTokenUser,
  validatorMiddleware.addToCart,
  UserController.updateCart
);

/* ORDER */

router.get("/order", Verify.verifyAccessTokenUser, UserController.getOrderList);

router.get("/city", Verify.verifyAccessTokenUser, UserController.getCity);

router.get(
  "/rajaongkir/cost",
  Verify.verifyAccessTokenUser,
  UserController.getCost
);

router.get(
  "/closest",
  Verify.verifyAccessTokenUser,
  UserController.findClosestWarehouse
);

module.exports = router;
