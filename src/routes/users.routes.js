import { Router } from "express";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { uploader } from "../middleware/uploader.middleware.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
import { RoleType } from "../constant/role.js";

export default class UsersRouter {
  path = "/users";
  router = Router();
  userManager = new UserManagerDao();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    this.router.post(`${this.path}/:uid/documents`, uploader.array("file"), async (req, res, next) => {
      try {
        if (!req.files) {
          throw new ClientError(
            "UserRouter",
            ErrorCode.BAD_PARAMETERS,
            400,
            "Document could not be loaded",
            "Document could not load"
          );
        }
        console.log(req.files);
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    });

    this.router.post(`${this.path}/premium/:uid`, authorization([RoleType.ADMIN]), async (req, res, next) => {
      const userId = req.params.uid;
      try {
        await this.userManager.togglePremium(userId);
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    });
  }
}
