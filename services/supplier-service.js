const { errorMessages } = require("../config/languages");
const { SupplierRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, CustomError } = require("../utils/app-errors");

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

  async GetSupplierById(supplierId) {
    return await this.repository.FindSupplierById(supplierId);
  }

  /** Delete Supplier by ID
   * @param {*} supplierId
   */
  async DeleteSupplierById(supplierId) {
    try {
      // Check supplier is exist
      const supplier = await this.repository.FindSupplierById(supplierId);

      if (!supplier) throw new CustomError(errorMessages.NOT_FOUND("supplier"));

      // Delete supplier
      await this.repository.DeleteSupplier(supplierId);

      // Send EMAIL to admin

      // Add activity
    } catch (err) {
      throw new CustomError(err.message, 400);
    }
  }

  async SearchSupplierByQuery(query) {
    const searchedSuppliers = this.repository.FindSupplierByName(query);

    return searchedSuppliers;
  }
}

module.exports = SupplierService;
