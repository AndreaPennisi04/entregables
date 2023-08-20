import { messagesModel } from "../models/messagesModel.models.js";

export default class MessagesManagerDao {
  getLastMessages = async (limit = 20) => {
    try {
      const lastMessages = await messagesModel.find({}).sort({ _id: -1 }).limit(limit);
      return lastMessages;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("MessagesManagerDao.getLastMessages", ErrorCode.DB_ISSUE);
    }
  };

  newMessage = async (message) => {
    try {
      await messagesModel.create(message);
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("MessagesManagerDao.newMessage", ErrorCode.DB_ISSUE);
    }
  };
}
