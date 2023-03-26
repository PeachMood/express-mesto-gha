const userSetter = (req, res, next) => {
  req.user = { userId: '641f4382e4ebf9c8da2c62e4' };
  next();
};

module.exports = userSetter;
