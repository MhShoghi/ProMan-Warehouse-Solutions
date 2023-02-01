const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    name: { type: String, required: true },
    __v: { type: Number, select: false },
  },
  {
    versionKey: false,
  }
);

const stateSchema = new Schema(
  {
    name: {
      type: String,
      requuired: true,
    },
    cities: [citySchema],
    __v: { type: Number, select: false },
  },
  {
    versionKey: false,
  }
);

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    states: [stateSchema],
    __v: { type: Number, select: false },
  },
  {
    versionKey: false,
  }
);

const CountryModel = mongoose.model("Country", countrySchema);
const StateModel = mongoose.model("State", stateSchema);
const CityModel = mongoose.model("City", citySchema);

module.exports = { CountryModel, StateModel, CityModel };
