import { messagesModel } from "../models/messagesManager.models.js";

export default class MessagesManagerDao {
  getLastMessages = async (limit = 20) => {
    try {
      const lastMessages = await messagesModel.find({}).sort({ _id: -1 }).limit(limit);
      return lastMessages;
    } catch (error) {}
  };

  newMessage = async (message) => {
    try {
      await messagesModel.create(message);
    } catch (error) {}
  };
}
