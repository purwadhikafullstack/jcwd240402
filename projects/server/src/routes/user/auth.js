const router = require("express").Router();
const AuthController = require("../../controllers/user/auth");

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/keep-login", AuthController.keepLogin);
router.patch(
  "/auth/verify-account/:verify-token",
  AuthController.verifyAccount
);
router.patch("/auth/resend-verify", AuthController.resendVerifyAccount);
router.post("/auth/forgot-password", AuthController.forgotPassword);
router.patch(
  "/auth/reset-password/:reset-password-token",
  AuthController.resetPassword
);
router.patch("/auth/close-account", AuthController.closeAccount);

module.exports = router;
