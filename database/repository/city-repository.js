const { APIError } = require("../../utils/app-errors");
const { CityModel } = require("../models");

class CityRepository {
  async AddCity({ name }) {
    try {
      const city = new CityModel({
        name,
      });

      return await city.save();
    } catch (err) {
      throw new APIError("Unable to add city");
    }
  }

  async DeleteCityById(cityId) {
    try {
      const deletedCity = await CityModel.findByIdAndDelete(cityId);

      return deletedCity;
    } catch (err) {
      throw new APIError("Unable to delete city");
    }
  }

  async UpdateCityById(cityId, filter) {
    try {
      const updatedCity = await CityModel.findByIdAndUpdate(cityId, filter, {
        new: true,
      });

      return updatedCity;
    } catch (err) {
      throw new APIError("Unable to delete city");
    }
  }

  async FindCityById(cityId) {
    try {
      const city = await CityModel.findById(cityId);
      return city;
    } catch (err) {
      throw new APIError("Unable to find city");
    }
  }

  /**
   * This method returns result of cities based on query parameters and key.
   * By default key is name
   * @param {*} key
   * @param {*} query
   */
  async FindCityByKeyAndQuery(key = "name", query) {
    try {
      const city = CityModel.find({
        [key]: { $regex: new RegExp(query, "i") },
      })
        .exec()
        .lean();

      return city;
    } catch (err) {
      throw new APIError("Unable to find city");
    }
  }
}

module.exports = CityRepository;
