import { userModel } from "../models/userManager.models.js";

export default class UserManagerDao {
  login = async (email, password) => {
    try {
      const user = await userModel.find({ email, password });
      return user;
    } catch (error) {
      throw new Error("There was an issue fetching the user from db");
    }
  };

  createUser = async ({ email, password, firstName, lastName, role }) => {
    try {
      await userModel.create({ first_name: firstName, last_name: lastName, email, password, role });
    } catch (error) {
      throw new Error("Error when creating a new user");
    }
  };

  resetPassword = async ({ email, password }) => {
    try {
      await userModel.updateOne({ email }, { password });
    } catch (error) {
      throw new Error("Error when changing password");
    }
  };

  getUserByEmail = async (email) => {
    try {
      const [user] = await userModel.find({ email });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
