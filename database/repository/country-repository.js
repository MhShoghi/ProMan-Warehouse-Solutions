const { APIError, STATUS_CODE } = require("../../utils/app-errors");
const { CountryModel, ProvinceModel, CityModel } = require("../models");

class CountryRepository {
  // Add Country
  async AddCountry(inputs) {
    try {
      const country = new CountryModel(inputs);

      return await country.save();
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to create country"
      );
    }
  }

  async GetCountryById(countryId) {
    const country = await CountryModel.findById(countryId);

    return country;
  }

  async GetCountries() {
    try {
      const countries = await CountryModel.find().lean();

      const total = await CountryModel.countDocuments();

      return { countries, total };
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to get all countries"
      );
    }
  }
}

module.exports = CountryRepository;
