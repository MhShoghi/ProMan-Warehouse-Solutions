const WarehouseService = require("../services/warehouse-service");
const {
  Response,
  GetFilters,
  GetPagination,
  IsValidObjectID,
} = require("../utils");
const auth = require("../api/middlewares/auth");

const { WarehouseValidator } = require("./validator");
const { errorMessages } = require("../config/languages");
const { CustomError } = require("../utils/app-errors");

/**
 * /warehouse POST create warehouse
 * /warehouse GET get all warehouses
 * /warehouse/:id GET get warehosue by id
 * /warehouse/:id PUT update warehouse by id
 * /warehouse/:id delete warehouse by id
 */

module.exports = (app) => {
  const Service = new WarehouseService();

  // Create new warehouse [admin, operator]
  app.post(
    "/warehouses",
    WarehouseValidator.createWarehouseValidation,
    async (req, res, next) => {
      try {
        const warehouse = await Service.CreateWarehouse(req.body);
        Response(res, "Create warehouse successful", warehouse, null, 201);
      } catch (err) {
        next(err);
      }
    }
  );

  // Get all warehouses
  app.get("/warehouses", async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = GetFilters(limit, page);

    const { total, results } = await Service.GetWarehouses(filters);

    const pagination = GetPagination(filters, total);

    Response(res, "Get warehouses", {
      count: results.length,
      pagination,
      warehouses: results,
    });
  });

  // search a warehouse by name
  app.get("/warehouses/search", async (req, res, next) => {
    try {
      const query = req.query.q;
      const { data } = await Service.GetWarehouseByName(query);

      res.json({ message: "Successfully", data, count: data.length });
    } catch (err) {
      next(err);
    }
  });

  // Get a warehouse by id
  app.get("/warehouses/:warehouseId", async (req, res, next) => {
    try {
      const warehouseId = req.params.warehouseId;
      const { data } = await Service.GetWarehouseById(warehouseId);

      res.json({ message: "Successfully", data });
    } catch (err) {
      next(err);
    }
  });

  // Update a warehouse
  app.put(
    "/warehouses/:warehouseId",

    async (req, res, next) => {
      const warehouseId = req.params.warehouseId;

      try {
        const warehouse = await Service.UpdateWarehouseById(
          warehouseId,
          req.body
        );

        Response(res, "Update warehouse", warehouse, null, 200);
      } catch (err) {
        next(err);
      }
    }
  );

  // Delete a warehouse by id
  app.delete("/warehouses/:warehouseId", auth, async (req, res, next) => {
    const warehouseId = req.params.warehouseId;

    try {
      const deletedWarehouse = await Service.DeleteWarehouseById(warehouseId);

      Response(
        res,
        "Delete warehouse successfully",
        {
          _id: deletedWarehouse._id,
          name: deletedWarehouse.name,
        },
        200
      );
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/warehouses/transfer",
    WarehouseValidator.TransferProductValidation,
    async (req, res, next) => {
      try {
        const transfer = await Service.TransferProduct(req.body);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post("/warehouses/:warehouseId/products", async (req, res, next) => {
    const warehouseId = req.params.warehouseId;
    const products = req.body.products;

    try {
      // Check WarehouseId is valid Object ID
      const isValid = IsValidObjectID(warehouseId);
      if (!isValid)
        throw new CustomError(errorMessages.IS_NOT_VALID("Warehouse ID"));

      const message = await Service.AddProductsToWarehouse(
        warehouseId,
        products
      );

      Response(res, message, null, null, 201);
    } catch (err) {
      next(err);
    }
  });
};
