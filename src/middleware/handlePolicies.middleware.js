import jwt from "jsonwebtoken";
import config from "../config/config.js";

const { SIGNING_SECRET } = config;

export const handlePolicies = (policies) => {
  return (req, res, next) => {
    if (policies[0] === "PUBLIC") {
      return next();
    }
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      res.status(401).send({ status: "error", error: "Unauthorised" });
    }
    const token = authHeaders.split(" ")[1];

    let user = jwt.verify(token, SIGNING_SECRET);

    if (!policies.includes(user.role.toUpperCase())) {
      return res.status(403).send({ error: "Bad request" });
    }

    req.user = user;
    next();
  };
};
