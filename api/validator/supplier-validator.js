const { body, param } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

const AddOrUpdateSupplierValidator = [
  body("name", "supplier name field is required")
    .isString()
    .withMessage("Supplier name can not be null"),
  body("address").isString(),
  body("type").isString(),
  body("phone").isString(),
  body("manager").isObject().withMessage("Type of field is wrong."),
  body("manager.name").isString().withMessage("Type of field must be string"),
  body("manager.email")
    .isEmail()
    .withMessage("Type of field must be like an email"),
  body("manager.phone").isString().withMessage("Type of field must be string"),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];

module.exports = { AddOrUpdateSupplierValidator };
