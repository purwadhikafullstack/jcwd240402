const admin = require("../routes/adminRouter");
const warehouse = require("./warehouseRouter");
const user = require("./userRouter");

module.exports = {
  admin,
  warehouse,
  user,
};
