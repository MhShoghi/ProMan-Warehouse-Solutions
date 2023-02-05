const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unitOfMeasurementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    abbreviation: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("UnitOfMeasurement", unitOfMeasurementSchema);
