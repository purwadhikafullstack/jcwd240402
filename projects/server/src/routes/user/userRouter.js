const router = require("express").Router();
const AuthController = require("../../controllers/user/userController");
const Verify = require("../../middleware/auth");
const upload = require("../../middleware/multer/user/imgProfile");

router.post("/auth/register", AuthController.registerUser);
router.post(
  "/auth/profile/:token",
  upload.single("file"),
  AuthController.registerProfile
);
router.post("/auth/login", AuthController.login);
router.get("/auth/keep-login", AuthController.keepLogin);

router.post("/auth/google-auth", AuthController.requestGoogleAuth);
router.get("/auth/google-auth", AuthController.oAuthGoogleAuth);

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
