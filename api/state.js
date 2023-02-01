const CountryService = require("../services/country-service");
const StateService = require("../services/state-service");
const { Response } = require("../utils");

module.exports = (app) => {
  // define a new Warehouse Service object

  const Service = new StateService();

  app.get("/states/:stateId/cities", async (req, res, next) => {
    const stateId = req.params.stateId;
    const city = req.body.name;

    try {
      const updatedState = await Service.AddCityToState(stateId, city);

      res.json({
        success: true,
        data: updatedState,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.put("/states/:stateId/cities/:cityId", async (req, res, next) => {
    try {
      //
    } catch (err) {
      next(err);
    }
  });
};
