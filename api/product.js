const ProductService = require("../services/product-service");
const { CreateProductValidator } = require("./validator/product-validator");

module.exports = (app) => {
  // product service must be added here
  const Service = new ProductService();

  /**
   * Create product
   * Admin | Operator
   * PRODUCT_CREATE
   */
  app.post("/products", CreateProductValidator, async (req, res) => {
    const { data } = await Service.CreateProduct(req.body);

    res.json({ data });
  });
};
