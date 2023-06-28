import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Schema.Types.Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
