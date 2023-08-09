const AuthRoute = require("express").Router();
const AuthController = require("../../controllers/user/auth");

AuthRoute.post("/auth/register", AuthController.register);
AuthRoute.post("/auth/login", AuthController.login);
AuthRoute.get("/auth/keep-login", AuthController.keepLogin);
AuthRoute.patch(
  "/auth/verify-account/:verify-token",
  AuthController.verifyAccount
);
AuthRoute.patch("/auth/resend-verify", AuthController.resendVerifyAccount);
AuthRoute.post("/auth/forgot-password", AuthController.forgotPassword);
AuthRoute.patch(
  "/auth/reset-password/:reset-password-token",
  AuthController.resetPassword
);
AuthRoute.patch("/auth/close-account", AuthController.closeAccount);

module.exports = AuthRoute;
