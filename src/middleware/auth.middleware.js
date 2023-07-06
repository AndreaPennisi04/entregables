export const authMdw = (req, res, next) => {
  if (req.session?.userId) {
    return next();
  }

  return res.redirect(307, "/api/v1/login");
};

export default authMdw;
