const authMdw = (req, res, next) => {
  console.log("session validation!!!!, 🚀 ~ file: auth.middleware.js:2 ~ authMdw ~ req:", req.session);
  if (req.session?.user || req.session?.admin) {
    return next();
  }

  return res.status(401).json({
    message: "Unauthorized access",
  });
};

module.export = authMdw;
