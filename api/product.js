const ProductService = require("../services/product-service");
const UnitOfMeasurementService = require("../services/unit-of-measurement-service");
const {
  Response,
  GetFilters,
  GetPagination,
  IsValidObjectID,
} = require("../utils");
const { ProductValidator } = require("./validator");

module.exports = (app) => {
  // product service must be added here
  const Service = new ProductService();
  const UnitService = new UnitOfMeasurementService();

  // Create a new product
  app.post(
    "/products",
    ProductValidator.CreateProductValidator,
    async (req, res, next) => {
      try {
        const product = await Service.CreateProduct(req.body);

        Response(res, "Create product", product, null, 200);
      } catch (err) {
        next(err);
      }
    }
  );

  // Return a list of all products based on limit and page query parameter
  app.get("/products", async (req, res, next) => {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;

      const filters = GetFilters(limit, page);

      const { products, total } = await Service.GetProducts(filters);

      const pagination = GetPagination(filters, total);

      Response(
        res,
        "Get all products",
        { pagination, count: products.length, products },
        null,
        200
      );
    } catch (err) {
      next(err);
    }
  });

  // Update a specific product based on id
  app.put(
    "/products/:productId",
    ProductValidator.UpdateProductValidator,
    async (req, res, next) => {
      const productId = req.params.productId;
      try {
        const updatedProduct = await Service.UpdateProductById(
          productId,
          req.body
        );

        Response(res, "Update product", updatedProduct, null, 200);
      } catch (err) {
        next(err);
      }
    }
  );

  // Delete a specific product based on id
  app.delete("/products/:productId", async (req, res, next) => {
    const productId = req.params.productId;
    try {
      const deletedProduct = await Service.DeleteProductById(productId);

      console.log(deletedProduct);
      Response(
        res,
        "Delete product successfully",
        { _id: deletedProduct._id, name: deletedProduct.name },
        null,
        200
      );
    } catch (err) {
      next(err);
    }
  });

  // Create a new Unit of Measurement for product
  app.post(
    "/products/unit-measurements",
    ProductValidator.CreateUnitOfMeasurementValidator,
    async (req, res, next) => {
      try {
        const unit = await UnitService.CreateUnitOfMeasurement(req.body);

        Response(
          res,
          "Create unit of measurement for product",
          unit,
          null,
          200
        );
      } catch (err) {
        next(err);
      }
    }
  );

  // Get a specific product unit of measurement based on id
  app.get("/products/unit-measurements", async (req, res, next) => {
    try {
      const units = await UnitService.GetAllUnitsOfMeasurement();
      Response(res, "Get all units of measurement", units, null, 200);
    } catch (err) {
      next(err);
    }
  });

  // Return a specific product based on the id
  app.get("/products/:productId", async (req, res, next) => {});

  // Update a specific product unit of measurement based on id
  app.put(
    "/products/unit-of-measurements/:unitId",
    async (req, res, next) => {}
  );
  //
  app.get("/products/by-supplier/:supplierId", async (req, res, next) => {
    const supplierId = req.params.supplierId;

    try {
      const products = await Service.GetProductsBySupplier(supplierId);

      Response(res, "Get products by supplier", products, null, 200);
    } catch (err) {
      next(err);
    }
  });
};
