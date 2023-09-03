import { Router } from "express";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import { authorization } from "../middleware/authorization.middleware.js";

export default class UsersRouter {
  path = "/users";
  router = Router();
  userManager = new UserManagerDao();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
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
