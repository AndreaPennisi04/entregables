import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const productItem = new Schema({
  productId: {
    type: Schema.Types.String,
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
  },
});

const cartSchema = new Schema({
  products: [productItem],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
