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
    default: RoleType.USER,
    enum: Object.values(RoleType),
  },
  age: Schema.Types.Number,
  last_connection: {
    type: Date,
    default: Date.now,
  },
  documents: {
    type: [
      {
        name: {
          type: Schema.Types.String,
          required: true,
        },
        reference: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
  },
});

export const userModel = mongoose.model(collection, userSchema);
