const warehouseController = require("../controllers/warehouseController");
const validatorMiddleware = require("../middleware/validator/admin");
const coordinatesMiddleware = require("../middleware/openCage/setCoordinates");
const warehouse_stockController = require("../controllers/warehouse_stockController");
const authMiddleware = require("../middleware/auth")
const router = require("express").Router();

router.post(
  "/register",
  coordinatesMiddleware,
  validatorMiddleware.validateRegisterWarehouse,
  warehouseController.registerWarehouse
);
router.get("/warehouse-list", warehouseController.getWarehouseList);

router.patch(
  "/:id",
  coordinatesMiddleware,
  warehouseController.updateWarehouse
);
router.get("/stock-history", authMiddleware.verifyAccessTokenAdmin,
warehouse_stockController.getStockHistoryList
);

module.exports = router;
