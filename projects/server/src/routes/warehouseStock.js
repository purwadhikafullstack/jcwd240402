const warehouseStockController = require("../controllers/warehouse_stockController")
const validatorMiddlewareWarehouseStock = require("../middleware/validator/warehouseStock");

const router = require("express").Router();

router.get("/", warehouseStockController.getWarehouseStocks);
router.post("/",validatorMiddlewareWarehouseStock.validateCreateStock,warehouseStockController.createStockForWarehouse)
router.patch("/:warehouseId/:productId",validatorMiddlewareWarehouseStock.validateUpdateStock,warehouseStockController.updateStockForWarehouse)
router.delete("/:warehouseId/:productId",validatorMiddlewareWarehouseStock.validateDeleteStock,warehouseStockController.deleteStockForWarehouse)

module.exports = router;