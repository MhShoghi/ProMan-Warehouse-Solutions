const mongoose = require("mongoose");
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
      city: { type: String },
      state: { type: String },
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
      type: String,
    },
    unique_id: {
      type: String,
    },
    status: {
      type: Boolean,
      default: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
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
