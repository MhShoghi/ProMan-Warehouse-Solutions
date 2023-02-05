const mongoose = require("mongoose");
const Product = require("./Product");
const Schema = mongoose.Schema;

const SupplierSchema = new Schema(
  {
    name: String,
    address: String,
    phone: String,
    type: String,
    manager: {
      name: String,
      phone: String,
      email: String,
    },
  },
  {
    versionKey: false,
  }
);

SupplierSchema.pre("remove", async function () {
  await Product.updateMany({ supplier: this._id }, { supplier: null });
});

module.exports = mongoose.model("Supplier", SupplierSchema);
