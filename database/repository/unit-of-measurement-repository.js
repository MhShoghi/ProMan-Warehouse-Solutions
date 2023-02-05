const { errorMessages } = require("../../config/languages");
const { CustomError } = require("../../utils/app-errors");
const { UnitOfMeasurement } = require("../models");

class UnitOfMeasurementRepository {
  async AddUnitOfMeasurement(inputs) {
    try {
      const unit = new UnitOfMeasurement({
        name: inputs.name,
        abbreviation: inputs.abbreviation,
      });

      return await unit.save();
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_CREATE("Unit of Measurement"),
        500,
        err.message
      );
    }
  }

  async UnitsOfMeasurement() {
    try {
      console.log("first");
      return await UnitOfMeasurement.find();
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_GET("Unit of Measurement"),
        500,
        err.message
      );
    }
  }
}

module.exports = UnitOfMeasurementRepository;
