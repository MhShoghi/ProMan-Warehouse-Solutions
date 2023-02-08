const { errorMessages } = require("../../config/languages");
const {
  APIError,
  STATUS_CODE,
  CustomError,
} = require("../../utils/app-errors");
const { WarehouseModel } = require("../models");

class WarehouseRepository {
  async CreateWarehouse(input) {
    try {
      const warehouse = new WarehouseModel({
        name: input.name,

        location: {
          address: input.location.address,
          country: input.location.country,
          city: input.location.city,
          state: input.location.state,
          zipcode: input.location.zipcode,
          latitude: input.location.latitude,
          longitude: input.location.longitude,
        },
        description: input.location.description,
        photos: input.photos ?? [],
        logo: input.logo,
        manager: {
          name: input.manager.name,
          email: input.manager.email,
          phone: input.manager.phone,
        },
        ...(input.status && { status: input.status }),
        unique_id: input.unique_id,
        products: [],
      });

      const warehouseResult = await warehouse.save();

      return warehouseResult;
    } catch (err) {
      throw new CustomError(err.message, 500);
    }
  }
  async FindWarehouse(filters) {
    const results = await WarehouseModel.find()
      .populate("products.product")
      .populate("products.unit")
      .populate("products.product.units")
      .limit(filters.limit)
      .skip(filters.startIndex);

    const total = await WarehouseModel.countDocuments();

    return { results, total };
  }

  async FindWarehouseById(warehouseId, session = null) {
    try {
      return await WarehouseModel.findById(warehouseId).session(session);
    } catch (err) {
      throw new CustomError(err.message);
    }
  }

  async FindWarehouseByKeyAndQuery(key, query) {
    try {
      return await WarehouseModel.find({
        [key]: { $regex: new RegExp(query, "i") },
      });
    } catch (err) {
      throw new APIError("Unable to get warehouse");
    }
  }

  async UpadteWarehouse(werehouseId, inputs) {
    try {
      return await WarehouseModel.findByIdAndUpdate(
        werehouseId,
        { $set: inputs },
        {
          new: true,
        }
      );
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_UPDATE("warehouse"));
    }
  }

  async DeleteWarehouse(warehouseId) {
    try {
      return await WarehouseModel.findByIdAndRemove(warehouseId);
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_DELETE("warehouse"));
    }
  }

  async AddProduct(warehouseId, productId, unitId, quantity, session = null) {
    let result = await WarehouseModel.updateOne(
      { _id: warehouseId },
      {
        $push: {
          products: {
            product: productId,
            unit: unitId,
            quantity: quantity,
          },
        },
      }
    ).session(session);
    return result;
  }

  async UpdateStock(warehouse, product, quantity, session) {
    product.quantity += quantity;

    await warehouse.save({ session: session });
  }
}

module.exports = WarehouseRepository;
