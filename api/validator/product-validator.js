const { body } = require("express-validator");
const ValidateRequest = require("../middlewares/validate-request");

module.exports.CreateProductValidator = [
  body("name").isString().withMessage("Product name must be entered"),
  body("description").isString().optional({ nullable: true }),
  // body("type"),
  // body('unit'),
  body("available").isBoolean().default(0),
  body("supplier")
    .isMongoId()
    .withMessage("Supplier must be a supplier id that created before"),
  (req, res, next) => {
    ValidateRequest(req, res, next);
  },
];
