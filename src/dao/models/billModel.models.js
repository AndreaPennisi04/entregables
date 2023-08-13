import mongoose, { Schema } from "mongoose";

const billCollection = "bill";

const billSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  code: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  total: {
    type: Schema.Types.Number,
    required: true,
  },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        price: {
          type: Schema.Types.Number,
          required: true,
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

export const billModel = mongoose.model(billCollection, billSchema);
