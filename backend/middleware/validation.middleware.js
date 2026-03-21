const { body, param, validationResult } = require("express-validator");



const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(
      errors.array().map(err => err.msg).join(", ")
    );
    error.status = 400;
    return next(error);
  }

  next();
};


const validateSignup = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors
];

const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors
];



const validateCreateEmployee = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  body("role")
    .isIn(["admin", "manager", "supervisor", "employee", "user"])
    .withMessage("Invalid role"),

  body("departmentId")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a positive integer"),

  handleValidationErrors
];

const validateChangeEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  handleValidationErrors
];

const validateChangePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),

  handleValidationErrors
];

const validateUserIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),

  handleValidationErrors
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateEmployee,
  validateChangeEmail,
  validateChangePassword,
  validateUserIdParam
};