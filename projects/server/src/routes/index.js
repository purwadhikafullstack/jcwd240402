const admin = require("../routes/adminRouter");
const warehouse = require("./warehouseRouter");
const user = require("./userRouter");
const warehouseStock = require("./warehouseStockRouter")

module.exports = {
  admin,
  warehouse,
  user,
  warehouseStock,
};
