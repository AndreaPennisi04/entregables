import { RoleType } from "../../constant/role.js";
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
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.login", ErrorCode.DB_ISSUE);
    }
  };

  togglePremium = async (userId) => {
    try {
      const user = await userModel.findOne({ _id: userId });

      await userModel.updateOne(
        { _id: userId },
        {
          ...user,
          role: user.role === RoleType.USER || user.role === RoleType.ADMIN ? RoleType.PREMIUM : RoleType.USER,
        }
      );
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.togglePremium", ErrorCode.DB_ISSUE);
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
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.createUser", ErrorCode.DB_ISSUE);
    }
  };

  resetPassword = async ({ email, password }) => {
    try {
      await userModel.updateOne({ email }, { password: createHash(password) });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.resetPassword", ErrorCode.DB_ISSUE);
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
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.getUserByEmail", ErrorCode.DB_ISSUE);
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
      if (error.code) {
        throw error;
      }
      throw new ClientError("UserManagerDao.getUserById", ErrorCode.DB_ISSUE);
    }
  };
}
