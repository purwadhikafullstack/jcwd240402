const { check, body, validationResult } = require("express-validator");

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

module.exports = {
  registration: validate([
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("Username can't contain spaces"),
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
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be valid email"),
    body("phone", "phone cannot be empty")
      .notEmpty()
      .withMessage("phone is required")
      .isMobilePhone()
      .withMessage("must be valid phone number"),
    body("img_profile").optional(),
    body("password", "password cannot be empty")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("confirm_password")
      .notEmpty()
      .withMessage("You must type a confirmation password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("The passwords do not match"),
  ]),

  registrationByOAuth: validate([
    body("fullname")
      .notEmpty()
      .withMessage("fullname is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be valid email"),
    body("phone").optional(),
    body("img_profile").optional(),
  ]),

  login: validate([
    body("user_identification")
      .notEmpty()
      .withMessage("Username or email is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("password", "password cannot be empty")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
  ]),

  loginByOAuth: validate([
    body("email")
      .notEmpty()
      .withMessage("Username or email is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
  ]),

  emailInput: validate([
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must be valid email"),
  ]),

  resetPassword: validate([
    body("reset_password_token")
      .notEmpty()
      .withMessage("reset password code is required"),
    body("new_password", "password cannot be empty")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("confirm_password")
      .notEmpty()
      .withMessage("You must type a confirmation password")
      .custom((value, { req }) => value === req.body.new_password)
      .withMessage("The passwords do not match"),
  ]),

  registerAddress: validate([
    body("city_id").notEmpty().withMessage("City ID is required"),
    body("address_details").notEmpty().withMessage("Address is required"),
    body("postal_code").notEmpty().withMessage("postal code is required"),
    body("address_title").notEmpty().withMessage("address title is required"),
  ]),

  updateProfile: validate([
    body("username")
      .optional()

      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 to 20 characters long.")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage("Username can't contain spaces"),
    body("first_name")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("last_name")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email").optional().isEmail().withMessage("must to in valid email"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("must be valid phone number"),
    body("password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("new_password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password have to contains 8 character with lowercase, uppercase, number, dan special character"
      ),
    body("new_confirm_password")
      .optional()
      .custom((value, { req }) => value === req.body.new_password)
      .withMessage("The passwords do not match"),
  ]),

  addToCart: validate([
    body("qty").notEmpty().withMessage("quantity is required"),
    body("product_name").notEmpty().withMessage("product name is required"),
  ]),
};
