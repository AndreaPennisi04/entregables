import mongoose, { Schema } from "mongoose";

const collection = "Users";
const userSchema = new Schema({
  first_name: Schema.Types.String,
  last_name: Schema.Types.String,
  email: {
    type: Schema.Types.String,
    unique: true,
  },
  password: Schema.Types.String,
  role: Schema.Types.String,
});

export const userModel = mongoose.model(collection, userSchema);
