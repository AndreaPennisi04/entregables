const mongoose = require("mongoose");

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
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
  cardID: {
    type: Number,
    required: true,
  },
  product: {
    type: Array,
    default: [],
  },
});

const cartModel = mongoose.model(cartCollection, cartSchema);
module.export = cartModel;
