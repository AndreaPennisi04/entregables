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
      if (!user) {
        return undefined;
      }
      delete user.password;
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        userId: user._id,
        email: user.email,
        age: user.age,
      };
    } catch (error) {
      throw new Error("There was an issue fetching the user from db");
    }
  };

  createUser = async ({ email, password, firstName, lastName, role, age }) => {
    try {
      const newUser = await userModel.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: createHash(password),
        role,
        age,
      });
      delete newUser.password;

      return {
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        userId: newUser._id,
        email: newUser.email,
        age: newUser.age,
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
      const user = await userModel.findOne({ email });
      if (!user) {
        return undefined;
      }
      delete user.password;
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        userId: user._id,
        email: user.email,
        age: user.age,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getUserById = async (id) => {
    try {
      const user = await userModel.find({ _id: id });
      delete user.password;
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        userId: user._id,
        email: user.email,
        age: user.age,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
