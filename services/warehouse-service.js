const {
  WarehouseRepository,
  UserRepository,
  CountryRepository,
  ProductRepository,
} = require("../database");
const { APIError, CustomError } = require("../utils/app-errors");
const { FormateData, Error } = require("../utils");
const errorMessages = require("../config/languages/errorMessages-en");

const ProductService = require("./product-service");
const TransferService = require("./transfer-service");
const { WarehouseModel } = require("../database/models");
const { TRANSFER_TYPES, TRANSFER_STATUS } = require("../config/constants");
const { default: mongoose } = require("mongoose");

// All Business Logic will be here
class WarehouseService {
  constructor() {
    this.repository = new WarehouseRepository();
    this.countryRepository = new CountryRepository();
    this.productRepository = new ProductRepository();

    this.productService = new ProductService();
    this.transferService = new TransferService();
  }

  async CreateWarehouse(inputs) {
    try {
      const { location } = inputs;
      // Check country is exist

      const existingCountry = await this.countryRepository.GetCountryById(
        location.country
      );
      if (!existingCountry)
        throw new CustomError(errorMessages.COUNTRY_NOT_FOUND);

      // Check state is exist

      const existingState = existingCountry.states.id(location.state);
      if (!existingState) throw new CustomError(errorMessages.STATE_NOT_FOUND);

      // Check city is exist
      const cityExist = existingState.cities.id(location.city);
      if (!cityExist) throw new CustomError(errorMessages.CITY_NOT_FOUND);

      const warehouseResult = await this.repository.CreateWarehouse(inputs);

      return warehouseResult;
    } catch (err) {
      throw new CustomError(err.message, 500);
    }
  }

  async GetWarehouses(filters) {
    try {
      return await this.repository.FindWarehouse(filters);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not Found!");
    }
  }

  async GetWarehouseByName(query) {
    const result = await this.repository.FindWarehouseByKeyAndQuery(
      "name",
      query
    );

    return FormateData(result);
  }

  async GetWarehouseById(warehouseId) {
    // Get warehouse by ID
    const warehouseResult = await this.repository.FindWarehouseById(
      warehouseId
    );

    // Warehouse not found error
    if (!warehouseResult)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND);

    // Response to Route API
    return FormateData(warehouseResult);
  }

  async UpdateWarehouseById(warehouseId, inputs) {
    // Check warehouse is exist or not
    const warehouseIsExist = await this.GetWarehouseById(warehouseId);
    if (!warehouseIsExist)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND, 404);

    return await this.repository.UpadteWarehouse(warehouseId, inputs);
  }

  async DeleteWarehouseById(warehouseId) {
    // Check warehouse is exist or not

    const warehouseIsExist = await this.GetWarehouseById(warehouseId);
    if (!warehouseIsExist)
      throw new CustomError(errorMessages.WAREHOUSE_NOT_FOUND, 404);

    return await this.repository.DeleteWarehouse(warehouseId);
  }

  async TransferProduct(input) {
    // Get body from input
    const { from, to, items } = input;

    // Retrieve the source warehouse where the product is currently stored, whether it's a fixed warehouse or a portable warehouse.

    // Check if the product exists in the source warehouse and if it has enough units to be transferred.

    // Create a transfer object to keep track of the transfer details, including the source and target warehouses, the product being transferred, the number of units being transferred, the date of transfer, and a unique transfer ID.

    // Update the source warehouse by subtracting the number of units being transferred from the product's total units.

    // Update the target warehouse by adding the number of units being transferred to the product's total units or creating a new product entry if it doesn't already exist.

    // Save the transfer object.

    // Return the updated source and target warehouses and the transfer object as a result of the method.
  }

  async CheckProductAvailability(warehouseId, productId) {
    let result = await WarehouseModel.findOne({
      _id: warehouseId,
      products: {
        $elemMatch: {
          productId: productId,
        },
      },
    });
    return result ? result : false;
  }

  async AddProductsToWarehouse(warehouseId, products) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.transferService.NewTransfer({
        from: null,
        to: warehouseId,
        type: TRANSFER_TYPES.SUPPLIER_TO_STATIC,
        status: TRANSFER_STATUS.PENDING,
      });

      // Checking warehouse with this ID is exist or not
      const warehouse = await this.CheckWarehouseAvailability(
        warehouseId,
        session
      );

      // Checking the availability of products entered in the product collection
      await this.productService.CheckProductsAvailability(products, session);

      // Checking each product and adding it to the warehouse
      for (let i = 0; i < products.length; i++) {
        const { productId, unitId, quantity } = products[i];
        // Find the product using the product ID in the warehouse
        const product = this.ProductExists(warehouse, productId);

        // If the product is not in stock, a product must be added
        if (!Boolean(product)) {
          await this.repository.AddProduct(
            warehouseId,
            productId,
            unitId,
            quantity,
            session
          );
        } else {
          // If the product was in stock, the product inventory should be increased
          await this.repository.UpdateStock(
            warehouse,
            product,
            quantity,
            session
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      return "Updated successfully";
    } catch (err) {
      await session.abortTransaction();

      Error({
        message: "Operation Failed",
        status: err.statusCode,
        err: err.message,
      });
    } finally {
      session.endSession();
    }
  }

  async CheckWarehouseAvailability(warehouseId, session) {
    const warehouse = await this.repository.FindWarehouseById(
      warehouseId,
      session
    );
    if (!warehouse)
      Error({ message: errorMessages.WAREHOUSE_NOT_FOUND, status: 404 });

    return warehouse;
  }

  ProductExists(warehouse, productId) {
    return warehouse.products.find(
      (p) => p.product._id.toString() === productId
    );
  }

  async GetWarehouseByAddress() {}
}

module.exports = WarehouseService;
