const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");

const PortableWarehouse = new Schema({
  name: {
    type: String,
    required: true,
    default: uuid.v1(),
  },
  products: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      unit: mongoose.SchemaTypes.ObjectId,
      ref: "UnitOfMeasurement",
    },
  ],
});

module.exports = PortableWarehouse;
