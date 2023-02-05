const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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

  unit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "unit",
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "category",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "outOfStock", "discontinued"],
    default: "available",
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
});

module.exports = mongoose.model("product", ProductSchema);
