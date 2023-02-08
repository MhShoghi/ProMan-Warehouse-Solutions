const { errorMessages } = require("../../config/languages");
const { CustomError } = require("../../utils/app-errors");
const { UnitOfMeasurementModel } = require("../models");

class UnitOfMeasurementRepository {
  async AddUnitOfMeasurement(inputs) {
    try {
      const unit = new UnitOfMeasurementModel({
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
      return await UnitOfMeasurementModel.find();
    } catch (err) {
      throw new CustomError(
        errorMessages.UNABLE_TO_GET("Unit of Measurement"),
        500,
        err.message
      );
    }
  }

  async FindUnitOfMeasurementById(unitId) {
    try {
      return await UnitOfMeasurementModel.findById(unitId);
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("unit of measurement"));
    }
  }
}

module.exports = UnitOfMeasurementRepository;
