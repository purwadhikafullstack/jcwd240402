const warehouseController = require("../controllers/warehouseController");
const validatorMiddleware = require("../middleware/validator/admin");
const coordinatesMiddleware = require("../middleware/openCage/setCoordinates");
const warehouse_stockController = require("../controllers/warehouseStockController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.post(
  "/register",
  coordinatesMiddleware,
  validatorMiddleware.validateRegisterWarehouse,
  warehouseController.registerWarehouse
);

router.patch(
  "/:id",
  coordinatesMiddleware,
  validatorMiddleware.removeEmptyFields,
  validatorMiddleware.validateUpdateWarehouse,
  warehouseController.updateWarehouse
);

router.get("/warehouse-list", warehouseController.getWarehouseList);
router.get(
  "/stock-history",
  authMiddleware.verifyAccessTokenAdmin,
  warehouse_stockController.getStockHistoryList
);
router.get("/:name", warehouseController.getWarehouseByName);

module.exports = router;
