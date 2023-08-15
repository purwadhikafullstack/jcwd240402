const router = require("express").Router();
const UserController = require("../../controllers/user/userController");
const Verify = require("../../middleware/auth");
const validatorMiddleware = require("../../middleware/validator/user");
const upload = require("../../middleware/multer/user/imgProfile");
const addressUserCoordinate = require("../../middleware/openCage/addressUserCoordinate");

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

/* PROFILING */
router.get(
  "/profile",
  Verify.verifyAccessToken,
  UserController.userInformation
);

router.post(
  "/profile/address",
  Verify.verifyAccessToken,
  validatorMiddleware.registerAddress,
  addressUserCoordinate,
  UserController.registerAddress
);

router.patch(
  "/profile",
  Verify.verifyAccessToken,
  upload.single("file"),
  UserController.updateUserInformation
);

router.get("/region-city", UserController.regionUserForCity);
router.get("/region-province", UserController.regionUserForProvince);

module.exports = router;
