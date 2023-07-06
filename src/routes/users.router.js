import { Router } from "express";

export default class Users {
  path = "/users";
  router = Router();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    //Get
    this.router.get(`${(this.path, "./")}`, async (req, res) => {
      res.render("profile", {
        user: req.session.user,
      });
    });

    //Login
    this.router.get(`${(this.path, "./login")}`, async (req, res) => {
      res.render("login");
    });

    //register
    this.router.get(`${(this.path, "./register")}`, async (req, res) => {
      res.render("register");
    });
  }
}
