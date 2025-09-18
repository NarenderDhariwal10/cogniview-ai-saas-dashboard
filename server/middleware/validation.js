// server/middleware/validation.js
import { body, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({ field: err.param, message: err.msg })),
      });
    }
    next();
  };
};

export const registerValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const createTeamValidation = [body("name").notEmpty().withMessage("Team name is required").trim().escape()];
