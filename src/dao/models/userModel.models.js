import mongoose, { Schema } from "mongoose";
import { RoleType } from "../../constant/role.js";

const collection = "Users";
const userSchema = new Schema({
  first_name: Schema.Types.String,
  last_name: Schema.Types.String,
  email: {
    type: Schema.Types.String,
    unique: true,
  },
  password: Schema.Types.String,
  role: {
    type: Schema.Types.String,
    default: "USER",
    enum: Object.values(RoleType),
  },
  age: Schema.Types.Number,
});

export const userModel = mongoose.model(collection, userSchema);
