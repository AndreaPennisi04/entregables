import { Router } from "express";
import UserManagerDao from "../dao/managers/userManager.manager.js";
import { generateJWT, passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";

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
      const { email, password } = req.body;

      try {
        const signUser = await this.userManager.login(email, password);
        if (!signUser) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = await generateJWT({ ...signUser });

        req.user = { ...signUser };
        res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });

        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
      }
    });

    // Get logout
    this.router.get(`${this.path}/logout`, async (req, res) => {
      res.clearCookie("eCommerceCookieToken").send();
    });

    //Register
    this.router.post(`${this.path}/register`, async (req, res) => {
      const { firstName, lastName, email, role, age, password } = req.body;
      try {
        let user = await this.userManager.getUserByEmail(email);
        if (user) {
          console.log("user already exists");
          return res.status(400).json({ message: `User ${email} already exists` });
        }
        const newUser = {
          firstName,
          lastName,
          email,
          password,
          role,
          age,
        };
        let signUser = await this.userManager.createUser(newUser);

        const token = await generateJWT({ ...signUser });

        req.user = { ...signUser };
        res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });

        return res.status(204);
      } catch (error) {
        return done(`Error al obtener el usuario: ${error.message}`);
      }
    });

    // Get Github
    this.router.get(
      `${this.path}/github`,
      passportCall("github", { scope: ["user:email"], session: false }),
      async (req, res) => {
        return res.status(204).send();
      }
    );

    // Get Callback Github
    this.router.get(`${this.path}/gitHubCallback`, passportCall("github", { session: false }), async (req, res) => {
      const { user } = req;
      if (!user) {
        return res.status(400).json({ message: "Login failed" });
      }

      const token = await generateJWT({ ...user });

      req.user = { ...user };
      res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });

      return res.redirect("/views/cart");
    });

    // Get session
    this.router.get(`${this.path}`, [passportCall("jwt"), authorization(["ADMIN", "USER"])], async (req, res) => {
      return res.status(200).json(req.user);
    });
  }
}
