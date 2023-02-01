const WarehouseService = require("../services/warehouse-service");
const ValidateRequest = require("./middlewares/validate-request");
const { body } = require("express-validator");
const {
  createWarehouseValidation,
} = require("./validator/warehouse-validator");
const router = require("express").Router();

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
  app.post("/warehouses", createWarehouseValidation, async (req, res, next) => {
    try {
      const { data } = await Service.CreateWarehouse(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // Get all warehouses
  app.get("/warehouses", async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * 10;
    const endIndex = page * limit;

    const filters = { page, limit, startIndex, endIndex };

    const { total, results } = await Service.GetWarehouses(filters);

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    return res.json({
      success: true,
      count: results.length,
      pagination,
      data: results,
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
  app.patch("/warehouses/:warehouseId", (req, res, next) => {
    const warehouseId = req.params.warehouseId;
  });

  // Delete a warehouse by id
  app.delete("/warehouses/:warehouseId", (req, res, next) => {});
};
