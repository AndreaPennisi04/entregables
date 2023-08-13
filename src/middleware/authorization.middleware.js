export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: `Unauthorized` });
    if (req.user.role != role) return res.status(401).json({ message: "No enough permissions" });

    next();
  };
};
