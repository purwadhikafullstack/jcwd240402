const warehouseController = require("../controllers/warehouseController");
const validatorMiddleware = require("../middleware/validator");
const router = require("express").Router();

router.post(
  "/register",
  validatorMiddleware.validateRegisterWarehouse,
  warehouseController.registerWarehouse
);

module.exports = router;
