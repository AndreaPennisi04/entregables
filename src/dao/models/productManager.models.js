import mongoose, { Schema } from "mongoose";

const productCollection = "products";

const productSchema = new Schema({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  price: {
    type: Schema.Types.String,
    required: true,
  },
  thumbnail: {
    type: Schema.Types.String,
    required: true,
  },
  code: {
    type: Schema.Types.Number,
    unique: true,
  },
  stock: {
    type: Schema.Types.Number,
    required: true,
  },
});

export const productModel = mongoose.model(productCollection, productSchema);
