const { SupplierRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

class SupplierService {
  constructor() {
    this.repository = new SupplierRepository();
  }

  async AddSupplier(supplierInputs) {
    try {
      const supplierResult = await this.repository.CreateSupplier(
        supplierInputs
      );
      return FormateData(supplierResult);
    } catch (err) {
      throw new APIError("Data Not Found", err);
    }
  }

  async UpdateSupplierById(supplierId, filters) {
    const updatedSupplier = await this.repository.UpdateSupplierById(
      supplierId,
      filters
    );

    return updatedSupplier;
  }

  async GetSuppliers(filters) {
    const suppliers = await this.repository.Suppliers(filters);

    return suppliers;
  }
}

module.exports = SupplierService;
