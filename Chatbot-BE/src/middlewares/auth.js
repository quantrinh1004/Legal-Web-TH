const asyncMiddleware = require('./async');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const authService = require('../services/user');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(codes.UNAUTHORIZED);

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer') throw new Error(codes.UNAUTHORIZED);

  const { user } = await authService.verifyAccessToken(accessToken);
  req.user = user;
  if (['/users/logout', '/users/verify'].includes(req.path)) {
    req.accessToken = accessToken;
  }

  return next();
};

module.exports = {
  auth: asyncMiddleware(auth),
};
