import { Router } from "express";
import fs from "fs";
import path from "path";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { uploader } from "../middleware/uploader.middleware.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
import { RoleType } from "../constant/role.js";
import { rename, unlink } from "fs/promises";
import getFolderNameFromFileType from "../utils/getFolderNameFromFileType.js";
import { passportCall } from "../utils/jwt.js";
import { FileTypes } from "../utils/FileTypes.js";

export default class UsersRouter {
  path = "/users";
  router = Router();
  userManager = new UserManagerDao();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    this.router.post(
      `${this.path}/:uid/documents`,
      passportCall("jwt"),
      authorization([RoleType.ADMIN, RoleType.PREMIUM, RoleType.USER]),
      uploader.array("file"),
      async (req, res, next) => {
        try {
          if (!req.files || !req.body?.type) {
            throw new ClientError(
              "UserRouter",
              ErrorCode.BAD_PARAMETERS,
              400,
              "Document could not be loaded",
              "Document could not load"
            );
          }

          const userId = req.params.uid;
          const { internal: fileTypeFolder } = getFolderNameFromFileType(req.body.type, userId);

          if (
            ![FileTypes.ACCOUNT_STATEMENT, FileTypes.ID, FileTypes.ADDRESS_PROOF, FileTypes.AVATAR].includes(
              req.body.type
            )
          ) {
            for (const file of req.files) {
              await unlink(file.path);
            }
            throw new ClientError(
              "UploadDocument",
              ErrorCode.BAD_PARAMETERS,
              400,
              "You can only upload user documents here",
              "Wrong Endpoint"
            );
          }

          const user = await this.userManager.getUserById(userId);

          if (!user) {
            for (const file of req.files) {
              await unlink(file.path);
            }
            throw new ClientError("UploadDocument", ErrorCode.BAD_PARAMETERS, 400, "User not found", "User not found");
          }

          if (req.user.role !== RoleType.ADMIN && user.userId !== userId) {
            for (const file of req.files) {
              await unlink(file.path);
            }
            throw new ClientError("UploadDocument", ErrorCode.UNAUTHORISED);
          }

          for (const file of req.files) {
            fs.mkdirSync(fileTypeFolder, { recursive: true });
            await rename(file.path, path.join(fileTypeFolder, file.filename));
            this.userManager.createFile(userId, { originalFilename: file.filename, fileType: req.body.type });
          }

          return res.status(204).send();
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.post(
      `${this.path}/premium/:uid`,
      passportCall("jwt"),
      authorization([RoleType.ADMIN]),
      async (req, res, next) => {
        const userId = req.params.uid;
        try {
          await this.userManager.togglePremium(userId);
          return res.status(204).send();
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
