const mongoose = require("mongoose");
const Warehouse = require("./Warehouse");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
      required: true,
    },
    unit: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "unit",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    supplier: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "supplier",
      default: null,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

ProductSchema.pre("findOneAndDelete", async function (next) {
  const product = this;
  try {
    await Warehouse.updateMany(
      { "products.product": product._id },
      { $pull: { products: { product: product._id } } }
    );
  } catch (error) {
    next(error);
  }
  next();
});

module.exports = mongoose.model("product", ProductSchema);
