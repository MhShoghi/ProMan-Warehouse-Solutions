const SupplierService = require("../services/supplier-service");
const { Response } = require("../utils");
const { AddSupplierValidator } = require("./validator/supplier-validator");

module.exports = (app) => {
  // const Service = new SupplierService();
  const Service = new SupplierService();

  // Add a new supplier
  app.post("/suppliers", AddSupplierValidator, async (req, res) => {
    const { data } = await Service.AddSupplier(req.body);

    Response(res, "Successful", data, null, 200);
  });

  // Retrieve all suppliers
  app.get("/suppliers", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filters = { startIndex, limit };
    const { results, total } = await Service.GetSuppliers(filters);

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

    Response(res, "Successful", {
      pagination,
      suppliers: results,
      count: results.length,
    });
  });

  // Retrieve a supplier via supplier id
  app.get("/suppliers/:supplierId", (req, res) => {});

  // Update a supplier
  app.put("/suppliers/supplierId", (req, res) => {});

  // Delete a supplier via supplier Id
  app.delete("/suppliers/:supplierId", (req, res) => {});
};
