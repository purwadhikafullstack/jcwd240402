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

const checkWarehouseName = async (value, { req }) => {
  try {
    const name = await db.Warehouse.findOne({
      where: { warehouse_name: value },
    });
    if (name) {
      throw new Error("Name has already been taken");
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

  validateRegistration: validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .custom(checkUsernameAdmin)
      .custom((value) => {
        if (/\s/.test(value)) {
          throw new Error("Username cannot contain spaces.");
        }
        return true;
      }),
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage("Password min 8 chars,1 Uppercase,1 Symbol and 1 Number")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required"),
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
      .withMessage("Password min 8 chars,1 Uppercase,1 Symbol and 1 Number")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),

  validateRegisterWarehouse: validate([
    body("address_warehouse").notEmpty().withMessage("Address is required"),
    body("warehouse_name")
      .notEmpty()
      .withMessage("Warehouse name is required")
      .custom(checkWarehouseName),
    body("city_id").notEmpty().withMessage("City ID is required"),
    body("latitude").notEmpty().withMessage("Latitude is required"),
    body("longitude").notEmpty().withMessage("Longtitude is required"),
    body("warehouse_contact")
      .notEmpty()
      .withMessage("Warehouse contact is required")
      .isNumeric()
      .withMessage("Contact should be a valid number"),
    body("province_id").notEmpty().withMessage("Province is required"),
    body("city_id").notEmpty().withMessage("City is required"),
  ]),

  validateUpdateWarehouse: validate([
    body("address_warehouse")
      .optional()
      .notEmpty()
      .withMessage("Address is required"),
    body("warehouse_name")
      .optional()
      .notEmpty()
      .withMessage("Warehouse name is required")
      .custom(checkWarehouseName),
    body("city_id")
      .optional()
      .notEmpty()
      .withMessage("City ID is required")
      .isNumeric()
      .withMessage("City ID must be a number"),
    body("province_id")
      .optional()
      .custom((value, { req }) => {
        if (value && !req.body.city_id) {
          throw new Error("City is required when updating Province");
        }
        return true;
      })
      .isNumeric()
      .withMessage("Province ID must be a number"),
    body("latitude")
      .optional()
      .notEmpty()
      .withMessage("Latitude is required")
      .isNumeric()
      .withMessage("Latitude must be a number")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude should be between -90 and 90"),
    body("longitude")
      .optional()
      .notEmpty()
      .withMessage("Longitude is required")
      .isNumeric()
      .withMessage("Longitude must be a number")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude should be between -180 and 180"),
    body("warehouse_contact")
      .optional()
      .notEmpty()
      .withMessage("Warehouse contact is required")
      .isNumeric()
      .withMessage("Contact should be a valid number"),
  ]),
};
