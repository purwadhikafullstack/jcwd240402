const admin = require("../routes/admin/adminRouter");
const warehouse = require("../routes/admin/warehouseRouter");
const user = require("../routes/user/auth");

module.exports = {
  admin,
  warehouse,
  user,
};
