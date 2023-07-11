import { createHash, isValidPassword } from "../../utils/encrypt.js";
import { userModel } from "../models/userModel.models.js";

export default class UserManagerDao {
  login = async (email, password) => {
    try {
      const user = await userModel.findOne({ email });
      const valid = isValidPassword(user, password);
      if (!valid) {
        return undefined;
      }
      delete user.password;
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        userId: user._id,
        email: user.email,
      };
    } catch (error) {
      throw new Error("There was an issue fetching the user from db");
    }
  };

  createUser = async ({ email, password, firstName, lastName, role }) => {
    try {
      const newUser = await userModel.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: createHash(password),
        role,
      });
      delete newUser.password;

      return {
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        userId: newUser._id,
        email: newUser.email,
      };
    } catch (error) {
      throw new Error("Error when creating a new user");
    }
  };

  resetPassword = async ({ email, password }) => {
    try {
      await userModel.updateOne({ email }, { password: createHash(password) });
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
  getUserById = async (id) => {
    try {
      const [user] = await userModel.find({ _id: id });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
