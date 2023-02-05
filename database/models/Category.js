const mongoose = require("mongoose");
const Product = require("./Product");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

CategorySchema.pre("remove", async function (next) {
  const category = this;
  await Product.deleteMany({ category: category._id });

  next();
});

module.exports = mongoose.model("category", CategorySchema);
