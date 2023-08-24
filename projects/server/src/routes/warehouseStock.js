const warehouseStockController = require("../controllers/warehouse_stockController")
const validatorMiddlewareWarehouseStock = require("../middleware/validator/warehouseStock");

const router = require("express").Router();

router.get("/", warehouseStockController.getWarehouseStocks);//check ok
router.post("/",validatorMiddlewareWarehouseStock.validateCreateStock,warehouseStockController.createStockForWarehouse)//check ok
router.patch("/:warehouseId/:productId",validatorMiddlewareWarehouseStock.validateUpdateStock,warehouseStockController.updateStockForWarehouse)//check ok
router.delete("/:warehouseId/:productId",validatorMiddlewareWarehouseStock.validateDeleteStock,warehouseStockController.deleteStockForWarehouse)//check ok

module.exports = router;