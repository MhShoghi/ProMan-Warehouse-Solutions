const mongoose = require("mongoose");
const { WAREHOUSE_STATUS } = require("../../config/constants");
const Product = require("./Product");
const Schema = mongoose.Schema;

const WarehouseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    location: {
      address: { type: String },
      country: { type: mongoose.SchemaTypes.ObjectId, required: true },
      state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
      },
      city: { type: mongoose.SchemaTypes.ObjectId, required: true },

      zipcode: { type: String },
      latitude: { type: String },
      longitude: { type: String },
    },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product" },
        unit: { type: Number, require: true },
        qunatity: { type: Number },
      },
    ],
    photos: [
      {
        name: String,
        url: String,
        description: String,
      },
    ],
    logo: {
      type: String,
    },
    manager: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    unique_id: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        WAREHOUSE_STATUS.ACTIVE,
        WAREHOUSE_STATUS.INACTIVE,
        WAREHOUSE_STATUS.OUT_SERVICE,
        WAREHOUSE_STATUS.UNDER_MAINTENANCE,
      ],
      default: WAREHOUSE_STATUS.ACTIVE,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("warehouse", WarehouseSchema);
