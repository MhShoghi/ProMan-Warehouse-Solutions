const errorMessages = require("../config/errorMessages");
const { StateRepository, CityRepository } = require("../database");
const { CustomError } = require("../utils/app-errors");

class StateService {
  constructor() {
    this.repository = new StateRepository();
    this.cityRepository = new CityRepository();
  }

  async AddState(name) {
    return await this.repository.AddState(name);
  }

  async AddCityToState(stateId, cityId) {
    // Check state with this ID is exist or not
    const state = await this.repository.FindStateById(stateId);

    if (!state) throw new CustomError(errorMessages.STATE_NOT_FOUND);

    // Check city is exist or not
    const city = await this.cityRepository.FindCityById(cityId);
    if (!city) throw new CustomError(errorMessages.CITY_NOT_FOUND);

    state.cities.push(city);
    return await state.save();
  }
}

module.exports = StateService;
