const successMessages = require("../config/successMessages");
const CountryService = require("../services/country-service");
const { Response } = require("../utils");

module.exports = (app) => {
  const Service = new CountryService();

  // Add country
  app.post("/countries", async (req, res, next) => {
    try {
      const name = req.body.name;
      // Add country service

      const { data } = await Service.AddCountry(name);

      res.json({ success: true, message: "Country added", data });
    } catch (err) {
      next(err);
    }
  });

  // Add state to country
  app.get("/countries/:countryId/states", async (req, res, next) => {
    const countryId = req.params.countryId;
    const state = req.body.name;

    try {
      const updatedCountry = await Service.AddStateToCountry(countryId, state);

      Response(res, "Country updated", updatedCountry);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  // Add city to state of a country
  app.get("/countries/:countryId/states/:stateId", async (req, res, next) => {
    const countryId = req.params.countryId;
    const stateId = req.params.stateId;
    const city = req.body.name;

    try {
      const updatedState = await Service.AddCityToState(
        countryId,
        stateId,
        city
      );

      res.json({
        success: true,
        data: updatedState,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.get("/countries", async (req, res, next) => {
    try {
      const { countries, total } = await Service.GetCountries();

      Response(res, "Get all countries", { countries, total });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  // Delete a city by cityId from a specific state
  app.delete(
    "/countries/:countryId/states/:stateId/cities/:cityId",
    async (req, res, next) => {
      try {
        const countryId = req.params.countryId;
        const statesId = req.params.stateId;
        const cityId = req.params.cityId;

        const { city } = await Service.DeleteCityFromState(
          countryId,
          statesId,
          cityId
        );

        Response(res, `City ${city} deleted successfully.`);
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
  );

  app.delete("/countries/:countryId", async (req, res, next) => {
    try {
      const countryId = req.params.countryId;

      await Service.DeleteCountry(countryId);

      res.json({
        success: true,
        message: successMessages.COUNTRY_DELETE,
      });
    } catch (err) {
      next(err);
    }
  });
};
