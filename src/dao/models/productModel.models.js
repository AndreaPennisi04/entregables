import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { RoleType } from "../../constant/role";

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
  owner: {
    type: Schema.Types.String,
    required: true,
    default: RoleType.ADMIN,
  },
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);
