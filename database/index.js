module.exports = {
  databaseConnnection: require("./connection"),
  WarehouseRepository: require("./repository/warehouse-repository"),
  UserRepository: require("./repository/user-repository"),
  ProductRepository: require("./repository/product-repository"),
  SupplierRepository: require("./repository/supplier-repository"),
  ProjectRepository: require("./repository/project-repository"),
  CountryRepository: require("./repository/country-repository"),
  StateRepository: require("./repository/state-repository"),
  CityRepository: require("./repository/city-repository"),
  CategoryRepository: require("./repository/category-repository"),
  ActivityRepository: require("./repository/activity-repository"),
  UnitOfMeasurementRepository: require("./repository/unit-of-measurement-repository"),
};
