const errorMessages = require("../config/errorMessages");
const { CountryRepository, StateRepository } = require("../database");
const { StateModel, CityModel } = require("../database/models");
const { FormateData } = require("../utils");
const { APIError, CustomError } = require("../utils/app-errors");

class CountryService {
  constructor() {
    this.repository = new CountryRepository();
    this.stateRepository = new StateRepository();
  }

  async AddCountry(name) {
    try {
      const countryResult = await this.repository.AddCountry({ name });

      return FormateData(countryResult);
    } catch (err) {
      throw new APIError("Data Not Found!");
    }
  }

  async AddStateToCountry(countryId, name) {
    // Check country is exist with countryID
    const country = await this.repository.GetCountryById(countryId);
    if (!country) throw new CustomError(errorMessages.COUNTRY_NOT_FOUND, 404);

    // Check state is exist with stateID
    const state = new StateModel({
      name,
    });

    // add state to states object in country collection
    country.states.push(state);
    return await country.save();
  }

  async AddCityToState(countryId, stateId, name) {
    // Check country is exist with countryID
    const country = await this.repository.GetCountryById(countryId);
    if (!country) throw new CustomError(errorMessages.COUNTRY_NOT_FOUND, 404);

    // Check state with this ID is exist or not

    const stateObject = country.states.id(stateId);
    if (!stateObject) throw new CustomError(errorMessages.STATE_NOT_FOUND);

    const city = new CityModel({
      name,
    });

    stateObject.cities.push(city);

    return await country.save();
  }

  async DeleteCountry(countryId) {
    try {
      // Check country with this ID is exist or not
      const country = await this.repository.FindCountryById(countryId);

      if (!country) throw new CustomError(errorMessages.COUNTRY_NOT_FOUND);

      await StateModel.deleteMany({ country: country._id });
      await country.remove();
    } catch (err) {
      next(err);
    }
  }

  async GetCountries() {
    try {
      return await this.repository.GetCountries();
    } catch (err) {
      throw new APIError("Data Not Found");
    }
  }

  async DeleteCityFromState(countryId, stateId, cityId) {
    // Check country is exist with countryID
    const country = await this.repository.GetCountryById(countryId);
    if (!country) throw new CustomError(errorMessages.COUNTRY_NOT_FOUND, 404);

    // Check state is exist in the country
    const state = country.states.id(stateId);
    if (!state) throw new CustomError(errorMessages.STATE_NOT_FOUND, 404);

    // Check state is exist in the country
    const city = state.cities.id(cityId);
    if (!city) throw new CustomError(errorMessages.CITY_NOT_FOUND, 400);

    city.remove();
    await country.save();

    return { city: city.name };
  }
}

module.exports = CountryService;
