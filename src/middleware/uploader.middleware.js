import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = `${__dirname}/public/uploads`;
    // LLEGUE HASTA ACA VER DE TRAER TYPE DEL ARCHIVO EN EL REQ PARA ACOMODAR POR CARPETA

    cb(null, `${__dirname}/public/documents`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
