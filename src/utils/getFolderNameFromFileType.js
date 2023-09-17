import path from "path";
import { URL } from "url";
import __dirname from "../utils.js";
import { FileTypes } from "../utils/FileTypes.js";
import config from "../config/config.js";

export default function getFolderNameFromFileType(type, userId) {
  const { API_URL } = config;
  let rootFolder = "/public/uploads";
  let userFolder = userId ? `/${userId}` : "";

  let specificFolder = "";
  switch (type) {
    case FileTypes.ACCOUNT_STATEMENT:
      specificFolder = `/documents/statements${userFolder}`;
      break;
    case FileTypes.ADDRESS_PROOF:
      specificFolder = `/documents/address-proof${userFolder}`;
      break;
    case FileTypes.ID:
      specificFolder = `/documents/id${userFolder}`;
      break;
    case FileTypes.PRODUCT_IMAGE:
      specificFolder = "/product";
      break;
    case FileTypes.AVATAR:
      specificFolder = `/avatars${userFolder}`;
      break;
    case FileTypes.TEMP:
      specificFolder = "/temp";
      break;
    default:
      specificFolder = `/others${userFolder}`;
  }

  const externalURL = new URL(`${rootFolder}${specificFolder}`, API_URL).toString();

  return {
    internal: path.join(__dirname, rootFolder, specificFolder),
    external: externalURL,
  };
}
