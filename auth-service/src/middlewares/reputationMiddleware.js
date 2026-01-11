export const reputationAuth = (req, res, next) => {
  if (req.headers["x-internal-key"] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
