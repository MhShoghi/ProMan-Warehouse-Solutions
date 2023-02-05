const SupplierService = require("../services/supplier-service");
const { errorMessages } = require("../config/languages");
const { Response, GetFilters, GetPagination } = require("../utils");
const { CustomError } = require("../utils/app-errors");
const { SupplierValidator } = require("./validator");

module.exports = (app) => {
  // const Service = new SupplierService();
  const Service = new SupplierService();

  // Add a new supplier
  app.post(
    "/suppliers",
    SupplierValidator.AddOrUpdateSupplierValidator,
    async (req, res) => {
      const { data } = await Service.AddSupplier(req.body);

      Response(res, "Successful", data, null, 200);
    }
  );

  // Retrieve all suppliers
  app.get("/suppliers", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = GetFilters(limit, page);
    const { results, total } = await Service.GetSuppliers(filters);

    const pagination = GetPagination(filters, total);

    Response(res, "Get suppliers successfull ", {
      pagination,
      suppliers: results,
      count: results.length,
    });
  });

  // Retrieve a supplier via supplier id
  app.get("/suppliers/:supplierId", async (req, res) => {
    const supplierId = req.params.supplierId;
    try {
      const supplier = await Service.GetSupplierById(supplierId);

      Response(res, "Get supplier by ID", supplier, null, 200);
    } catch (err) {
      next(err);
    }
  });

  // Update a supplier
  app.put(
    "/suppliers/:supplierId",
    SupplierValidator.AddOrUpdateSupplierValidator,
    async (req, res, next) => {
      const supplierId = req.params.supplierId;
      try {
        const updatedSupplier = await Service.UpdateSupplierById(
          supplierId,
          req.body
        );

        Response(
          res,
          "Update supplier successfull",
          { supplier: updatedSupplier },
          null,
          200
        );
      } catch (err) {
        next(err);
      }
    }
  );

  // Delete a supplier via supplier Id
  app.delete("/suppliers/:supplierId", async (req, res) => {
    // Get supplier id from params
    const supplierId = req.params.supplierId;

    if (!supplierId)
      throw new CustomError(errorMessages.REQUIRED_PARAMETER("supplier ID"));

    try {
      // call the service
      await Service.DeleteSupplierById(supplierId);

      Response(res, "Deleted succesfully", null, null, 200);
    } catch (err) {
      next(err);
    }
  });

  app.get("/suppliers/search", async (req, res, next) => {
    try {
      const searchQuery = req.query.q;

      if (!searchQuery)
        throw new CustomError(errorMessages.QUERY_PARAM_NOT_FOUND("query"));

      const suppliers = Service.SearchSupplierByQuery(searchQuery);

      Response(res, "Search supplier", suppliers, null, 200);
    } catch (err) {
      next(err);
    }
  });
};
