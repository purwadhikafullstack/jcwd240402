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

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkProductName = async (value, { req }) => {
  if (!value) return true;

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

const removeEmptyFields = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === null || req.body[key] === undefined) {
      delete req.body[key];
    }
  });
  next();
};

module.exports = {
  removeEmptyFields,

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
      .withMessage("The price must be a valid number.")
      .isFloat({ max: 999999999 })
      .withMessage("The price cannot exceed 999,999,999"),
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
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkProductName),
    body("price")
      .optional()
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("The price must be a valid number.")
      .isFloat({ max: 999999999 })
      .withMessage("The price cannot exceed 999,999,999"),
    body("weight")
      .optional()
      .notEmpty()
      .withMessage("Weight is required")
      .isNumeric()
      .withMessage("Weight must be a number"),
    body("category_id")
      .optional()
      .notEmpty()
      .withMessage("Category is required")
      .isNumeric()
      .withMessage("Category id must be a number")
      .custom(checkCategory),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 200 })
      .withMessage("Description max 200 characters"),
  ]),
};
