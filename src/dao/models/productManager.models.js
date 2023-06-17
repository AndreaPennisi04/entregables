const mongoose = require("mongoose");

const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  thumbnail: {
    require: true,
  },
  code: {
    type: Number,
    require: true,
    unique: true,
  },
  stock: {
    type: Number,
    require: true,
  },
});

const productModel = mongoose.model(productCollection, productSchema);
module.exports = productModel;
