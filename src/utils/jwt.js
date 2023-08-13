import jwt from "jsonwebtoken";
import passport from "passport";
import config from "../config/config.js";

const { SIGNING_SECRET, API_URL } = config;

export const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SIGNING_SECRET, { expiresIn: "30m", audience: API_URL }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["eCommerceCookieToken"];
  }

  return token;
};

export const passportCall = (strategy, options) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, options, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res.redirect(307, "/login");
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
