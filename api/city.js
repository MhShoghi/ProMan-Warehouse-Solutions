const CityService = require("../services/city-service");
const { Response } = require("../utils");

module.exports = (app) => {
  const Service = new CityService();

  app.post("/cities", async (req, res, next) => {
    try {
      const savedCity = await Service.AddCity(req.body);

      Response(res, "Add city successfull", savedCity);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cities", async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  });

  app.get("/cities/:cityId", async (req, res, next) => {});

  app.put("/cities/:cityId", async (req, res, next) => {
    const cityId = req.params.cityId;

    try {
      const savedCity = await Service.UpdateCityById(cityId, req.body);

      Response(res, "Updated succuessfully", savedCity);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cities/:cityId", async (req, res, next) => {
    const cityId = req.params.cityId;

    try {
      const deletedCity = await Service.DeleteCityById(cityId);

      Response(res, "Deleted successfully", `${deletedCity.name}`);
    } catch (err) {
      next(err);
    }
  });
};
