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
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
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

  emailInput: validate([
    body("email", "email cannot be empty")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("must to in valid email"),
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
    body("data")
      .notEmpty()
      .withMessage("edit form cannot be empty")
      .custom((value) => {
        try {
          const jsonData = JSON.parse(value);
          if (!jsonData.username) {
            throw new Error("username is required");
          }
          if (!isEmail(jsonData.email)) {
            throw new Error("email is required");
          }
          if (!jsonData.first_name) {
            throw new Error("first name is required");
          }
          if (!jsonData.last_name) {
            throw new Error("last name is required");
          }
          if (!isMobilePhone(jsonData.phone)) {
            throw new Error("invalid phone number");
          }
          if (!jsonData.password) {
            throw new Error("invalid phone number");
          }
          return true;
        } catch (error) {
          throw new Error(`${error}`);
        }
      }),
    body("file").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Photo is required");
      }
      return true;
    }),
  ]),
};
