const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

module.exports.AddSupplierValidator = [
  body("name", "supplier name field is required")
    .isString()
    .withMessage("Supplier name can not be null"),
  body("type").isString(),

  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];
