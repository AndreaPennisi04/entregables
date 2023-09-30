import { RoleType } from "../../constant/role.js";
import { generateToken } from "../../utils/encrypt.js";
import { temporaryCredentialsModel } from "../models/temporaryCredentialsModel.models.js";
import { userModel } from "../models/userModel.models.js";

export default class TemporaryCredentialsDao {
  createTemporaryCredentials = async (email) => {
    try {
      const token = generateToken();
      const user = await userModel.findOne({ email });

      // Si no se encuentra el usuario retornamos un token de todas maneras
      // esto es para evitar fuerza bruta sobre emails
      if (!user) {
        return token;
      }

      await temporaryCredentialsModel.deleteOne({ user: user._id });

      await temporaryCredentialsModel.create({
        user: user._id,
        token,
      });

      return token;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("TemporaryCredentialsDao.createTemporaryCredentials", ErrorCode.DB_ISSUE);
    }
  };

  validateTemporaryCredentials = async (token) => {
    const result = await temporaryCredentialsModel
      .findOne({
        token,
      })
      .populate(RoleType.USER);

    return result.user;
  };
}
