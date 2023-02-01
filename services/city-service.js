const errorMessages = require("../config/errorMessages");
const { CityRepository } = require("../database");
const { CustomError } = require("../utils/app-errors");

class CityService {
  constructor() {
    this.repository = new CityRepository();
  }

  async AddCity(inputs) {
    const savedCity = await this.repository.AddCity(inputs);

    return savedCity;
  }

  async UpdateCityById(cityId, inputs) {
    // Find city by id
    const city = await this.repository.FindCityById(cityId);
    if (!city) throw new CustomError(errorMessages.CITY_NOT_FOUND);

    // Update city
    return await this.repository.UpdateCityById(cityId, inputs);
  }
}

module.exports = CityService;
