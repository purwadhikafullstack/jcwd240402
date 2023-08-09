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

const checkUsernameAdmin = async (value, { req }) => {
  try {
    const user = await db.Admin.findOne({ where: { username: value } });
    if (user) {
      throw new Error("Username already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateRegistration: validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkUsernameAdmin),
    body("first_name")
      .notEmpty()
      .withMessage("first name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("last_name")
      .notEmpty()
      .withMessage("last name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
  ]),

  validateLogin: validate([
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),

  validatePassword: validate([
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage("Password min 8 chars,1 Uppercase,1 Symbol and 1 Number"),
  ]),

  validateRegisterWarehouse: validate([
    body("address_warehouse").notEmpty().withMessage("Address is required"),
    body("warehouse_name").notEmpty().withMessage("Warehouse name is required"),
    body("city_id").notEmpty().withMessage("City ID is required"),
    body("subdistrict_id").notEmpty().withMessage("Subdistrict ID is required"),
    body("province_id").notEmpty().withMessage("Province ID is required"),
    body("latitude").notEmpty().withMessage("Latitude is required"),
    body("longitude").notEmpty().withMessage("Longtitude is required"),
    body("warehouse_contact")
      .notEmpty()
      .withMessage("Warehouse contact is required"),
  ]),
};
