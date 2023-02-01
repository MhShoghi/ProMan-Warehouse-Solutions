const mongoose = require("mongoose");
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

module.exports = mongoose.model("Supplier", SupplierSchema);
