const { UnitOfMeasurementRepository } = require("../database");

class UnitOfMeasurementService {
  constructor() {
    this.repository = new UnitOfMeasurementRepository();
  }

  async CreateUnitOfMeasurement(input) {
    // Check unit is exist or not?

    // Create unit
    return await this.repository.AddUnitOfMeasurement(input);
  }

  async GetAllUnitsOfMeasurement() {
    return await this.repository.UnitsOfMeasurement();
  }
}

module.exports = UnitOfMeasurementService;
