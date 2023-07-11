import passport from "passport";
import local from "passport-local";
import UserManagerDao from "../dao/managers/userManager.manager.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  const userManager = new UserManagerDao();
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      const { firstName, lastName, email, role } = req.body;
      try {
        let user = await userManager.getUserByEmail(email);
        if (user) {
          console.log("user already exists");
          return done(null, false);
        }
        const newUser = {
          firstName,
          lastName,
          email,
          password,
          role,
        };
        let result = await userManager.createUser(newUser);
        return done(null, result);
      } catch (error) {
        return done(`Error al obtener el usuario: ${error.message}`);
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userManager.login(username, password);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (serUser, done) => {
    let user = await userManager.getUserByEmail(serUser.email);
    done(null, user);
  });
};

export default initializePassport;
