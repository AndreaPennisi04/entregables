import mongoose, { Schema } from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new Schema({
  user: {
    type: Schema.Types.String,
    required: true,
    //unique: true?
  },
  content: {
    type: Schema.Types.String,
    required: true,
  },
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);
