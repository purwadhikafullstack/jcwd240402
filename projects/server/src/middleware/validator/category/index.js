const { body, validationResult } = require("express-validator");
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

const checkCategoryName = async (value, { req }) => {
  try {
    const category = await db.Category.findOne({ where: { name: value } });
    if (category) {
      throw new Error("Category name already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateCategory: validate([
    body("name")
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkCategoryName),
  ]),
};
