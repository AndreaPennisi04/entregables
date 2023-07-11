import { Router } from "express";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import passport from "passport";

export default class SessionRouter {
  path = "/session";
  router = Router();
  userManager = new UserManagerDao();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    //Post login
    this.router.post(
      `${this.path}/login`,
      passport.authenticate("login", {
        failureRedirect: `${this.path}/failedlogin`,
      }),
      async (req, res) => {
        if (!req.user) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        return res.status(204).send();
      }
    );

    //Fail Login
    this.router.get(`${this.path}/failedlogin`, async (req, res) => {
      console.log("Failed Login");
      return res.send({ error: "failed" });
    });

    //Recover
    this.router.post(`${this.path}/recover`, async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await this.userManager.getUserByEmail(email);
        if (!user) {
          res.status(400).json({ message: "Invalid user" });
          return;
        }

        await this.userManager.resetPassword({ email, password });
        res.status(204).send();
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", payload: error.message });
      }
    });

    //Fail Register
    this.router.get(`${this.path}/failedregister`, async (req, res) => {
      console.log("Failed Register");
      res.send({ error: "failed" });
    });

    //Register
    this.router.post(
      `${this.path}/register`,
      passport.authenticate("register", {
        failureRedirect: `${this.path}/failedregister`,
      }),
      async (req, res) => {
        res.status(204).send();
      }
    );

    // Get logout
    this.router.get(`${this.path}/logout`, async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.json({ message: `logout successfully` });
        return res.json({ message: `logout Error`, body: err });
      });
    });

    // Get session
    this.router.get(`${this.path}`, async (req, res) => {
      return res.status(200).json(req.session.passport.user);
    });
  }
}
