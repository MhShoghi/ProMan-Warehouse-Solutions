const { WarehouseRepository, UserRepository } = require("../database");
const { APIError, CustomError } = require("../utils/app-errors");
const { FormateData } = require("../utils");
const { WarehouseModel } = require("../database/models");
const errorMessages = require("../config/errorMessages");

// All Business Logic will be here
class WarehouseService {
  constructor() {
    this.repository = new WarehouseRepository();
  }

  async CreateWarehouse(warehouseInputs) {
    try {
      const warehouseResult = await this.repository.CreateWarehouse(
        warehouseInputs
      );
      return FormateData(warehouseResult);
    } catch (err) {
      throw new APIError("Data Not Found", err);
    }
  }

  async GetWarehouses(filters) {
    try {
      return await this.repository.FindWarehouse(filters);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not Found!");
    }
  }

  async GetWarehouseByName(query) {
    const result = await this.repository.FindWarehouseByKeyAndQuery(
      "name",
      query
    );

    return FormateData(result);
  }

  async GetWarehouseById(warehouseId) {
    // Get warehouse by ID
    const warehouseResult = await this.repository.FindWarehouseById(
      warehouseId
    );

    // Warehouse not found error
    if (!warehouseResult)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND);

    // Response to Route API
    return FormateData(warehouseResult);
  }

  async UpdateWarehouseById(warehouseId, inputs) {}

  async GetWarehouseByAddress() {}
}

module.exports = WarehouseService;
