const { APIError, STATUS_CODE } = require("../../utils/app-errors");
const { WarehouseModel } = require("../models");

class WarehouseRepository {
  async CreateWarehouse({
    name,
    city,
    address,
    description,
    photos,
    logo,
    manager,
    status,
    unique_id,
    location,
    latitude,
    longitude,
  }) {
    try {
      const warehouse = new WarehouseModel({
        name,
        city,
        address,
        description,
        photos: photos ?? [],
        logo,
        manager,
        status: status ?? 0,
        unique_id,
        products: [],
        location: {
          latitude,
          longitude,
        },
      });

      const warehouseResult = await warehouse.save();

      return warehouseResult;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to create warehouse"
      );
    }
  }
  async FindWarehouse(filters) {
    const results = await WarehouseModel.find()
      .limit(filters.limit)
      .skip(filters.startIndex);

    const total = await WarehouseModel.countDocuments();

    return { results, total };
  }

  async FindWarehouseById({ id }) {
    try {
      return WarehouseModel.findById(id);
    } catch (err) {
      throw new APIError("Unable to get warehouse");
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

  async UpadteWarehouse(userId, inputs) {
    try {
      return await WarehouseModel.findByIdAndUpdate(userId, inputs, {
        new: true,
      });
    } catch (err) {
      throw new APIError("Unable to update warehouse");
    }
  }
}

module.exports = WarehouseRepository;
