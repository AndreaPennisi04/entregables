import { Router } from "express";
import UserManagerDao from "../dao/managers/userManager.manager.js";

export default class SessionRouter {
  path = "/session";
  router = Router();
  userManager = new UserManagerDao();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    //Post login
    this.router.post(`${this.path}/login`, async (req, res) => {
      try {
        const { email, password } = req.body;

        const [user] = await this.userManager.login(email, password);

        if (!user) {
          res.status(403).json({ message: "Invalid email or password" });
          return;
        }

        req.session.admin = user.role === "admin";
        req.session.email = user.email;
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;
        req.session.userId = user._id;

        res.status(204).send();

        return;
      } catch (error) {
        res.status(500).json({ status: "error", payload: error.message });
      }
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

    //Register
    this.router.post(`${this.path}/register`, async (req, res) => {
      try {
        const user = req.body;

        // segun el enunciado si viene adminCoder como emial lo grabo como admin,
        // supongo que esto se rectificara en algun momento
        user.role = user.email === "adminCoder" ? "admin" : "user";

        await this.userManager.createUser(user);

        const newUser = await this.userManager.getUserByEmail(user.email);

        req.session.admin = newUser.role === "admin";
        req.session.email = newUser.email;
        req.session.firstName = newUser.first_name;
        req.session.lastName = newUser.last_name;
        req.session.userId = newUser._id;

        res.status(204).send();
      } catch ({ message }) {
        res.status(500).json({ status: "error", payload: message });
      }
    });

    // Get logout
    this.router.get(`${this.path}/logout`, async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.json({ message: `logout successfully` });
        return res.json({ message: `logout Error`, body: err });
      });
    });

    // Get session
    this.router.get(`${this.path}`, async (req, res) => {
      return res.status(200).json(req.session);
    });
  }
}
