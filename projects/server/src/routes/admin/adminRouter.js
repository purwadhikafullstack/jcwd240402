const adminController = require("../../controllers/admin/adminController");
const validatorMiddleware = require("../../middleware/validator/admin");
const service = require("../../service/index");
const router = require("express").Router();

router.get("/profile", adminController.getAdminProfile);
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
router.get("/", adminController.getAdminList);

router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;
