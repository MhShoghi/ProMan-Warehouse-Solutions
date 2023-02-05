const { body, param } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

const UpdateCategoryValidator = [
  param("categoryId", "CategoryID is required")
    .isMongoId()
    .withMessage("Category id is wrong!"),
  body("name", "name is required")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be string"),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

module.exports = { UpdateCategoryValidator };
