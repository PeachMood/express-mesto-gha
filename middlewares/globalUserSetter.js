const globalUserSetter = (req, res, next) => {
  req.user = {
    _id: '641f4382e4ebf9c8da2c62e4',
  };
  next();
};

module.exports = globalUserSetter;
