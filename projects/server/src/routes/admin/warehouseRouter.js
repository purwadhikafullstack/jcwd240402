const warehouseController = require("../../controllers/admin/warehouseController");
const validatorMiddleware = require("../../middleware/validator/admin");
const coordinatesMiddleware =  require("../../middleware/openCage/setCoordinates")
const router = require("express").Router();




router.post("/register",validatorMiddleware.validateRegisterWarehouse,warehouseController.registerWarehouse);
router.get("/warehouse-list", warehouseController.getWarehouseList);
router.post("/:id",coordinatesMiddleware,warehouseController.updateWarehouse)

module.exports = router;
