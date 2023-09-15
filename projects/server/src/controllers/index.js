const admin = require(".adminController.js");
const warehouse = require("./warehouseController");
const product = require("./productController")
const user = require("./userController")
const warehouse_stock = require("./warehouse_stockController")
const inventory_transfer=require("./inventoryTransferController")
const order_detail=require("./orderDetail")

module.exports = {
  admin,
  warehouse,
  product,
  user,
  warehouse_stock,
  inventory_transfer,
  order_detail,
};
