import multer from "multer";
import getFolderNameFromFileType from "../utils/getFolderNameFromFileType.js";
import fs from "fs";
import { FileTypes } from "../utils/FileTypes.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpFolder = getFolderNameFromFileType(FileTypes.TEMP, req.user.userId);
    fs.mkdirSync(tmpFolder.internal, { recursive: true });
    cb(null, tmpFolder.internal);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
