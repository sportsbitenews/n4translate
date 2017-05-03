'use strict';
const jwt            = require('jsonwebtoken');
const expressJwt     = require('express-jwt');
const crypto         = require('crypto');
const _              = require('lodash');

const config = require('../../config.json');

const check = expressJwt({ secret: config.jwt_secret });
const User = require('../user/controller');

const authenticate = ({ email, password }) => {
  return User.findByEmail(email)
    .then((user) => {
      if(user && hash(password) === user.password) {
        return _.pick(user, ['$loki', 'name', 'admin']);
      }
    });
};

const hash = (password) => {
  return crypto.createHash(config.crypto.algorithm, config.crypto.salt)
    .update(password)
    .digest('base64');
};

const sign = (user) => {
  return jwt.sign(user, config.jwt_secret, { expiresIn: '1h' });
};

const verify = (token) => {
  // console.log(token);
  return jwt.verify(token, config.jwt_secret);
};


module.exports = {
  authenticate,
  check,
  hash,
  sign
}
