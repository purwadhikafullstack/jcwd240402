const adminController = require("../../controllers/admin/adminController");
const validatorMiddleware = require("../../middleware/validator/admin");
const router = require("express").Router();

router.post(
  "/register",
  validatorMiddleware.validateRegistration,
  adminController.registerAdmin
);

router.post(
  "/login",
  validatorMiddleware.validateLogin,
  adminController.loginAdmin
);

router.post(
  "/change-pass/:id",
  validatorMiddleware.validatePassword,
  adminController.changeAdminPassword
);
router.post("/assign-warehouse/:id", adminController.assignWarehouse);

module.exports = router;
