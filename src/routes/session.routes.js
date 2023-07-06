import { Router } from "express";

export default class SessionUser {
  path = "/session";
  router = Router();
  HomeSession = new SessionUser();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    //Get Login
    this.router.get(`${this.path}`, async (req, res) => {
      const username = req.body.username ?? req.query.username;
      const password = req.body.password ? req.body.password : req.query.password;
      const email = req.body.email || req.query.email;

      if (username !== "adminCoder" || password !== "adminCod3r123") {
        return res.json({ message: "Login failed" });
      }
      req.session.user = username;
      req.session.admin = true;
      req.session.email = email || emailQuery;
      return res.json({
        message: "Loging success",
      });
    });

    //Post login
    this.router.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const session = req.session;
        console.log("🚀 ~ file: session.routes.js:36 ~ SessionUser ~ this.router.post ~ session:", session);

        const findUser = await userModel.findOne({ email });
        console.log("🚀 ~ file: session.routes.js:40 ~ SessionUser ~ this.router.post ~ findUser:", findUser);

        if (!findUser) {
          return res.status(401).json({ message: "User not register yet/existent " });
        }

        if (findUser.password !== password) {
          return res.status(401).json({ message: "incorrect password" });
        }

        req.session.user = {
          ...findUser,
          password: "",
        };

        return res.render("profile", {
          last_name: req.session?.user?.last_name || findUser.last_name,
          email: req.session?.user?.email || email,
        });
      } catch (error) {
        console.log("🚀 ~ file: session.routes.js:66 ~ SessionUser ~ this.router.post ~ error:", error);
      }
    });

    //Post Register
    this.router.post("/register", async (req, res) => {
      try {
        const body = req.body;
        const newUser = await userModel.create(body);
        console.log("🚀 ~ file: session.routes.js:70 ~ SessionUser ~ this.router.post ~ newUser:", newUser);

        req.session.user = { ...body };
        return res.render("login");
      } catch (error) {
        console.log("🚀 ~ file: session.routes.js:75 ~ SessionUser ~ this.router.post ~ error:", error);
      }
    });

    // Get logout
    this.router.get("/logout", async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.json({ message: `logout successfully` });
        return res.send({ message: `logout Error`, body: err });
      });
    });

    //Get Logout
    this.router.get("/logout", async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({ message: `logout Error`, body: err });
      });
    });

    //Welcome message
    this.router.get("/welcome", async (req, res) => {
      const { name } = req.query;
      console.log("🚀 ~ file: session.routes.js:99 ~ SessionUser ~ this.router.get ~ name:", name);

      const couter = req.session?.counter;
      if (!couter) {
        req.session.counter = 1;
        return res.send(`Welcome ${name}`);
      }
      req.session.user = name;
      req.session.admin = true;
      req.session.counter++;
      return res.send(`Congratulations ${name}! You have successfully inputted your username`);
    });
  }
}
