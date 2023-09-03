import bcrypt from "bcrypt";
import crypto from "crypto";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (existingUser, incomingPassword) =>
  bcrypt.compareSync(incomingPassword, existingUser.password);

export const generateToken = () => crypto.randomBytes(48).toString("base64url");
