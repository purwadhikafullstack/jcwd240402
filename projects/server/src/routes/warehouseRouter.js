const warehouseController = require("../controllers/warehouseController");
const validatorMiddleware = require("../middleware/validator/admin");
const coordinatesMiddleware = require("../middleware/openCage/setCoordinates");
const warehouse_stockController = require("../controllers/warehouseStockController");
const handleImageWarehouseUpload = require("../middleware/multer/warehouse/imgWarehouse");

const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

router.post(
  "/register",authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageWarehouseUpload,
  coordinatesMiddleware,
  validatorMiddleware.validateRegisterWarehouse,
  warehouseController.registerWarehouse
);

router.patch(
  "/:id",authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageWarehouseUpload,
  coordinatesMiddleware,
  validatorMiddleware.removeEmptyFields,
  validatorMiddleware.validateUpdateWarehouse,
  warehouseController.updateWarehouse
);

router.patch(
  "/image/:warehouse_name",authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageWarehouseUpload,
  warehouseController.updateWarehouseImage
);

router.get("/warehouse-list", warehouseController.getWarehouseList);
router.get(
  "/stock-history",
  authMiddleware.verifyAccessTokenAdmin,
  warehouse_stockController.getStockHistoryList
);
router.get("/:name", warehouseController.getWarehouseByName);

router.delete("/:warehouseId",authMiddleware.verifyAccessTokenSuperAdmin, warehouseController.deleteWarehouse);

module.exports = router;
