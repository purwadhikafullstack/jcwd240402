const { body,param, validationResult } = require("express-validator");
const db = require("../../../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkWarehouseExists = async (value) => {
  const warehouse = await db.Warehouse.findByPk(value);
  if (!warehouse) {
    throw new Error("Warehouse not found");
  }
  return true;
};

const checkProductExists = async (value) => {
  const product = await db.Product.findByPk(value);
  if (!product) {
    throw new Error("Product not found");
  }
  return true;
};

module.exports = {
  validateCreateStock: validate([
    body("warehouseId")
      .notEmpty()
      .withMessage("Warehouse ID is required")
      .custom(checkWarehouseExists),
    body("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .custom(checkProductExists),
    body("productStock")
      .isNumeric()
      .withMessage("Product stock must be a number"),
  ]),

  validateUpdateStock: validate([
    param("warehouseId")
      .notEmpty()
      .withMessage("Warehouse ID is required")
      .isNumeric()
      .withMessage("Warehouse ID must be a number")
      .custom(checkWarehouseExists),
    param("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .isNumeric()
      .withMessage("Product ID must be a number")
      .custom(checkProductExists),
    body("productStock")
      .isNumeric()
      .withMessage("Product stock must be a number"),
    body("operation")
      .isIn(["increase", "decrease"])
      .withMessage("Operation must be either 'increase' or 'decrease'"),
  ]),

  validateDeleteStock: validate([
    param("warehouseId")
      .notEmpty()
      .withMessage("Warehouse ID is required")
      .isNumeric()
      .withMessage("Warehouse ID must be a number")
      .custom(checkWarehouseExists),
    param("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .isNumeric()
      .withMessage("Product ID must be a number")
      .custom(checkProductExists),
  ]),
};
