const warehouseStockController = require("../controllers/warehouseStockController");
const validatorMiddlewareWarehouseStock = require("../middleware/validator/warehouseStock");
const authMiddleware = require("../middleware/auth");

const router = require("express").Router();

router.get("/",authMiddleware.verifyAccessTokenAdmin, warehouseStockController.getWarehouseStocks);
router.post("/",validatorMiddlewareWarehouseStock.validateCreateStock,warehouseStockController.createStockForWarehouse);
router.patch("/:warehouseId/:productId",validatorMiddlewareWarehouseStock.validateUpdateStock,warehouseStockController.updateStockForWarehouse);

router.delete("/:warehouseId/:productId",warehouseStockController.deleteStockForWarehouse);

module.exports = router;
