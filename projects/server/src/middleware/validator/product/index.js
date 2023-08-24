const { body, param, validationResult } = require("express-validator");
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

    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ 
    //       message: "Validation failed", 
    //       errors: errors.array()[0].msg  double check later
    //   }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkProductName = async (value, { req }) => {
  try {
    const product = await db.Product.findOne({ where: { name: value } });
    if (product) {
      throw new Error("Product name already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkProduct = async (value, { req }) => {
  try {
    const id = await db.Product.findOne({
      where: { id: value },
    });
    if (!id) {
      throw new Error("Product not found");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkCategory = async (value, { req }) => {
  try {
    const id = await db.Category.findOne({
      where: { id: value },
    });
    if (!id) {
      throw new Error("Category not found");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateProduct: validate([
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkProductName),
    body("price")
      .notEmpty()
      .withMessage("Price name is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("weight")
      .notEmpty()
      .withMessage("weight is required")
      .isNumeric()
      .withMessage("Weight must be a number"),
    body("category_id")
      .notEmpty()
      .withMessage("Category is required")
      .isNumeric()
      .withMessage("Category id must be a number")
      .custom(checkCategory),
    body("description")
      .notEmpty()
      .isLength({ max: 200 })
      .withMessage("Description max 200 characters"),
  ]),

  validateUpdateProduct: validate([
    param("id")
      .notEmpty()
      .withMessage("Product id is required")
      .custom(checkProduct),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("weight")
      .optional()
      .isNumeric()
      .withMessage("Weight must be a number"),
    body("category_id")
      .optional()
      .isNumeric()
      .withMessage("Category id must be a number")
      .custom(checkCategory),
    body("description")
      .optional()
      .isLength({ max: 200 })
      .withMessage("Description max 200 characters"),
  ]),
};
