const warehouseStockController = require("../controllers/warehouseStockController");
const validatorMiddlewareWarehouseStock = require("../middleware/validator/warehouseStock");
const authMiddleware = require("../middleware/auth");

const router = require("express").Router();

router.get("/",authMiddleware.verifyAccessTokenAdmin, warehouseStockController.getWarehouseStocks);
router.post("/",authMiddleware.verifyAccessTokenAdmin,validatorMiddlewareWarehouseStock.validateCreateStock,warehouseStockController.createStockForWarehouse);
router.patch("/:warehouseId/:productId",authMiddleware.verifyAccessTokenAdmin,validatorMiddlewareWarehouseStock.validateUpdateStock,warehouseStockController.updateStockForWarehouse);

router.delete("/:warehouseId/:productId",authMiddleware.verifyAccessTokenAdmin,warehouseStockController.deleteStockForWarehouse);
router.delete("/:warehouseId/:productId",authMiddleware.verifyAccessTokenAdmin,warehouseStockController.deleteStockForWarehouse);

module.exports = router;
