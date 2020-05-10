const jwt = require('jsonwebtoken');
const constants = require('../config/Constants');

exports.sign = (payload) => jwt.sign(payload, process.env.JWTSECRET, {
  expiresIn: `${constants.AUTH_TOKEN_EXPIRY_HOURS}h`,
});

exports.signLong = (payload) => jwt.sign(payload, process.env.JWTSECRET);

exports.validate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: true,
      errors: [{ param: 'AUTH_TOKEN', msg: 'No Token Supplied' }],
    });
  }

  return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        errors: [{ param: 'AUTH_TOKEN', msg: err.message }],
      });
    }

    req.user = decoded;
    return next();
  });
};
