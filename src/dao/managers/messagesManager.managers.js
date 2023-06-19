import { messagesModel } from "../models/messagesManager.models.js";

export default class MessagesManagerDao {
  getLastMessages = async (limit = 20) => {
    try {
      const lastMessages = await messagesModel.find({}).limit(limit);
      return lastMessages;
    } catch (error) {
      console.log("🚀 ~ file: messagesManager.managers.js:9 ~ MessagesManagerDao ~ getLastMessages= ~ error:", error);
    }
  };

  newMessage = async (message) => {
    try {
      await messagesModel.create(message);
    } catch (error) {
      console.log("🚀 ~ file: messagesManager.managers.js:17 ~ MessagesManagerDao ~ newMessage= ~ error:", error);
    }
  };
}
