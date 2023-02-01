const { APIError } = require("../../utils/app-errors");
const { StateModel } = require("../models");

class StateRepository {
  async AddState({ name }) {
    try {
      const state = new StateModel({
        name,
      });

      return await state.save();
    } catch (err) {
      throw new APIError("Unable to add state");
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

  async FindStateById(stateId) {
    const state = await StateModel.findById(stateId);
    return state;
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

module.exports = StateRepository;
