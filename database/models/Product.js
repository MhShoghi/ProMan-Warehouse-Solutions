const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  description: String,
  banner: String,
  type: String,
  unit: Number,
  available: Boolean,
  supplier: {
    type: Schema.Types.ObjectId,
    ref: "supplier",
  },
});

module.exports = mongoose.model("product", ProductSchema);
