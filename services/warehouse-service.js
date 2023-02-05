const {
  WarehouseRepository,
  UserRepository,
  CountryRepository,
} = require("../database");
const { APIError, CustomError } = require("../utils/app-errors");
const { FormateData } = require("../utils");
const { WarehouseModel } = require("../database/models");
const errorMessages = require("../config/languages/errorMessages-en");

// All Business Logic will be here
class WarehouseService {
  constructor() {
    this.repository = new WarehouseRepository();
    this.countryRepository = new CountryRepository();
  }

  async CreateWarehouse(inputs) {
    try {
      const { location } = inputs;
      // Check country is exist

      const existingCountry = await this.countryRepository.GetCountryById(
        location.country
      );
      if (!existingCountry)
        throw new CustomError(errorMessages.COUNTRY_NOT_FOUND);

      // Check state is exist

      const existingState = existingCountry.states.id(location.state);
      if (!existingState) throw new CustomError(errorMessages.STATE_NOT_FOUND);

      // Check city is exist
      const cityExist = existingState.cities.id(location.city);
      if (!cityExist) throw new CustomError(errorMessages.CITY_NOT_FOUND);

      const warehouseResult = await this.repository.CreateWarehouse(inputs);

      return warehouseResult;
    } catch (err) {
      throw new CustomError(err.message, 500);
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

  async UpdateWarehouseById(warehouseId, inputs) {
    // Check warehouse is exist or not
    const warehouseIsExist = await this.GetWarehouseById(warehouseId);
    if (!warehouseIsExist)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND, 404);

    return await this.repository.UpadteWarehouse(warehouseId, inputs);
  }

  async GetWarehouseByAddress() {}

  async DeleteWarehouseById(warehouseId) {
    // Check warehouse is exist or not

    const warehouseIsExist = await this.GetWarehouseById(warehouseId);
    if (!warehouseIsExist)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND, 404);

    return await this.repository.DeleteWarehouse(warehouseId);
  }
}

module.exports = WarehouseService;
