const router = require("express").Router();
const UserController = require("../../controllers/user/userController");
const ProductController = require("../../controllers/product/productController");
const Verify = require("../../middleware/auth");
const validatorMiddleware = require("../../middleware/validator/user");
const upload = require("../../middleware/multer/user/imgProfile");
const addressUserCoordinate = require("../../middleware/openCage/addressUserCoordinate");
const addressUserCoordinateUpdate = require("../../middleware/openCage/addressUserCoordinateUpdate");

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
  upload.single("file"),
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
  upload.single("file"),
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
router.get("/product/:id", ProductController.getProductById);

module.exports = router;
