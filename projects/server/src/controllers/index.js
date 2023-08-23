const admin = require(".adminController.js");
const warehouse = require("./warehouseController");
const product = require("./productController")
const user = require("./userController")
const warehouse_stock = require("./warehouse_stockController")

module.exports = {
  admin,
  warehouse,
  product,
  user,warehouse_stock
};
