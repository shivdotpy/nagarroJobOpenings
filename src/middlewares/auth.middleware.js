const authMiddleware = (req, res, next) => {
  console.log("middleware, WIP");
  next();
};

module.exports = authMiddleware;
