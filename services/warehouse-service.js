const ProductService = require("./product-service");
const TransferService = require("./transfer-service");
const UserService = require("./user-service");

const {
  WarehouseRepository,
  CountryRepository,
  ProductRepository,
} = require("../database");
const { APIError, CustomError } = require("../utils/app-errors");
const { FormateData, Error } = require("../utils");
const errorMessages = require("../config/languages/errorMessages-en");

const { WarehouseModel } = require("../database/models");
const {
  TRANSFER_TYPES,
  TRANSFER_STATUS,
  UPDATE_PRODUCT_STOCK_TYPE,
} = require("../config/constants");
const { default: mongoose } = require("mongoose");

// All Business Logic will be here
class WarehouseService {
  constructor() {
    this.repository = new WarehouseRepository();
    this.countryRepository = new CountryRepository();
    this.productRepository = new ProductRepository();

    this.productService = new ProductService();
    this.transferService = new TransferService();
    this.userService = new UserService();
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
    return warehouseResult;
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Get body from input
      const { from, to, items } = input;

      // New transfer

      const transfer = await this.transferService.NewTransfer({
        products: items,
        from,
        to,
        status: TRANSFER_STATUS.PENDING,
        type: TRANSFER_TYPES.STATIC_TO_STATIC,
      });

      if (from === to)
        Error({
          message:
            "The specifications of the origin and destination warehouse cannot be the same",
          status: 400,
          err: {
            origin: from,
            destination: to,
          },
        });

      // Retrieve the source warehouse where the product is currently stored, whether it's a fixed warehouse or a portable warehouse.

      const sourceWarehouse = await this.CheckWarehouseAvailability(
        from,
        session
      );
      const destinationWarehouse = await this.CheckWarehouseAvailability(
        to,
        session
      );

      // Check all products in items is exist or not
      // Check if the product exists in the source warehouse and if it has enough units to be transferred.
      for (const { productId, unitId, quantity } of items) {
        const product = this.ProductExists(sourceWarehouse, productId);

        if (!product)
          return Error({
            message: `Product with ID ${productId} not found in the warehouse ${from}`,
            status: 404,
            err: { productId },
          });

        if (Number(product.quantity) < Number(quantity)) {
          return Error({
            message: `Not enough quantity of product ${productId} in the warehouse`,
            status: 404,
            err: { quantity },
          });
        }

        const { success } = await this.repository.UpdateProductStock(
          sourceWarehouse,
          UPDATE_PRODUCT_STOCK_TYPE.DECREMENT,
          product,
          quantity,
          session
        );

        const productDestinationWarehouse = this.ProductExists(
          destinationWarehouse,
          productId
        );

        // If the product is not in stock, a product must be added
        if (!Boolean(productDestinationWarehouse) && success) {
          await this.repository.AddProduct(
            destinationWarehouse,
            productId,
            unitId,
            quantity,
            session
          );
        }
        if (Boolean(productDestinationWarehouse) && success) {
          // If the product was in stock, the product inventory should be increased
          await this.repository.UpdateProductStock(
            destinationWarehouse,
            UPDATE_PRODUCT_STOCK_TYPE.INCREMENT,
            productDestinationWarehouse,
            quantity,
            session
          );
        }
      }

      await session.commitTransaction();

      await this.transferService.ChangeStatus(transfer._id, {
        status: TRANSFER_STATUS.COMPLETED,
      });

      return {
        message: "The products have been transferred successfully",
        success: true,
        data: {
          from_warehouse: sourceWarehouse.name,
          to_warehouse: destinationWarehouse.name,
        },
      };

      // Create a transfer object to keep track of the transfer details, including the source and target warehouses, the product being transferred, the number of units being transferred, the date of transfer, and a unique transfer ID.

      // Update the source warehouse by subtracting the number of units being transferred from the product's total units.

      // Save the transfer object.

      // Return the updated source and target warehouses and the transfer object as a result of the method.
    } catch (err) {
      await session.abortTransaction();
      await this.transferService.ChangeStatus(transfer._id, {
        status: TRANSFER_STATUS.REJECTED,
      });

      Error({
        message: err.message,
        status: err.statusCode,
        err: err.error,
      });
    } finally {
      await session.endSession();
    }
  }

  async CheckProductAvailability(warehouseId, productId, session = null) {
    let result = await WarehouseModel.findOne({
      _id: warehouseId,
      products: {
        $elemMatch: {
          productId: productId,
        },
      },
    }).session(session);
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
      for (const { productId, unitId, quantity } of products) {
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
          await this.repository.UpdateProductStock(
            warehouse,
            UPDATE_PRODUCT_STOCK_TYPE.INCREMENT,
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

  async TransferProductToUser(warehouseId, receiverId, products) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transfer = await this.transferService.NewTransfer({
        products,
        from: warehouseId,
        to: receiverId,
        type: TRANSFER_TYPES.STATIC_TO_PORTABLE,
      });

      const userId = await this.userService;
      const warehouse = await this.CheckWarehouseAvailability(
        warehouseId,
        session
      );

      for (const { productId, unitId, quantity } of products) {
        // Check product is exist in the warehouse
        const product = this.ProductExists(warehouse, productId);
        if (!products)
          Error({
            message: `Product with ID ${productId} not found in the warehouse ${warehouse.name}`,
          });

        // Check quantity
        if (product.quantity < quantity)
          Error({
            message: `Not enough quantity of product ${productId} in the warehouse ${warehouse.name}`,
          });
      }

      // Commit transaction
      await this.transferService.ChangeStatus(
        transfer,
        TRANSFER_STATUS.COMPLETED,
        session
      );
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      await this.transferService.ChangeStatus(
        transfer,
        TRANSFER_STATUS.REJECTED,
        session
      );

      Error({ message: err.message, status: err.statusCode, err });
    } finally {
      await session.endSession();
    }
  }
}

module.exports = WarehouseService;
