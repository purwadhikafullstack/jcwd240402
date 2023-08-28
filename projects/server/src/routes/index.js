const admin = require("../routes/adminRouter");
const warehouse = require("./warehouseRouter");
const user = require("./userRouter");
const warehouseStock = require("./warehouseStock")

module.exports = {
  admin,
  warehouse,
  user,
  warehouseStock,
};
