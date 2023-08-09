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

const registerValidation = [
  check("username", "username cannot be empty")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("minimum 3 character"),
  check("first_name", "first name cannot be empty").notEmpty(),
  check("last_name", "last name cannot be empty").notEmpty(),
  check("email", "email cannot be empty")
    .notEmpty()
    .isEmail()
    .withMessage("must to in valid email"),
  check("phone", "phone cannot be empty")
    .notEmpty()
    .isMobilePhone()
    .withMessage("must to in valid phone number"),
  check("password", "password cannot be empty")
    .notEmpty()
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
  check("confirmPassword")
    .notEmpty()
    .withMessage("You must type a confirmation password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match"),
];

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
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must to in valid email"),
    body("phone", "phone cannot be empty")
      .notEmpty()
      .withMessage("phone is required")
      .isMobilePhone()
      .withMessage("must to in valid phone number"),
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
};
