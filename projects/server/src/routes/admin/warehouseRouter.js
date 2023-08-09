const warehouseController = require("../../controllers/admin/warehouseController");
const validatorMiddleware = require("../../middleware/validator/admin");
const router = require("express").Router();

router.post(
  "/register",
  validatorMiddleware.validateRegisterWarehouse,
  warehouseController.registerWarehouse
);

module.exports = router;
