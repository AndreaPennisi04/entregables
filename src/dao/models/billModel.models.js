import mongoose, { Schema } from "mongoose";
import { BillStatus } from "../../utils/BillStatus.js";

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
  transactionId: {
    type: Schema.Types.String,
  },
  status: {
    type: Schema.Types.String,
    required: true,
    default: BillStatus.NotPaid,
    enum: Object.values(BillStatus),
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
