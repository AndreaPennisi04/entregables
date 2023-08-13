export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: `Unauthorized` });
    }
    if (!role.includes(req.user.role)) {
      return res.status(401).json({ message: "No enough permissions" });
    }

    next();
  };
};
