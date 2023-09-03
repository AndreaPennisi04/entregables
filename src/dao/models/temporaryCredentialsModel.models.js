import mongoose, { Schema } from "mongoose";

const collection = "temporary-credentials";
const temporaryCredentialsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true,
  },
  token: Schema.Types.String,
  expireAt: {
    type: Date,
    expires: 60 * 60,
  },
});

export const temporaryCredentialsModel = mongoose.model(collection, temporaryCredentialsSchema);
