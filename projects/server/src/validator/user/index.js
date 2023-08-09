const { check, body, validationResult } = require("express-validator");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: errors.array()[0].msg,
    });
  }
  next();
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
  runValidation,
  registerValidation,
};
