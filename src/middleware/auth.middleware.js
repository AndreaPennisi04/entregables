export const authMdw = (req, res, next) => {
  if (req.session?.passport?.user?.userId) {
    return next();
  }

  return res.redirect(307, "/login");
};

export default authMdw;
