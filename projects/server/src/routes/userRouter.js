const router = require("express").Router();
const AuthController = require("../controllers/userController");
const Verify = require("../middleware/auth");
const validatorMiddleware = require("../middleware/validator/user");
const upload = require("../middleware/multer/user/imgProfile");

router.post(
  "/auth/register",
  validatorMiddleware.registration,
  AuthController.registerUser
);
router.get("/auth/verify/:verify_token", AuthController.updateVerify);
router.post("/auth/login", validatorMiddleware.login, AuthController.login);
router.get(
  "/auth/keep-login",
  Verify.verifyRefreshToken,
  AuthController.keepLogin
);

router.post(
  "/auth/resend-verify",
  validatorMiddleware.emailInput,
  AuthController.resendVerifyAccount
);

router.post(
  "/auth/forgot-password",
  validatorMiddleware.emailInput,
  AuthController.forgotPassword
);
router.patch(
  "/auth/reset-password/:resetToken",
  validatorMiddleware.resetPassword,
  AuthController.resetPassword
);
router.patch("/auth/close-account", AuthController.closeAccount);

module.exports = router;
