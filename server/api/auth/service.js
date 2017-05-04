'use strict';
const jwt            = require('jsonwebtoken');
const crypto         = require('crypto');

const config = require('../../config.json');

const hash = (password) => {
  return crypto.createHash(config.crypto.algorithm, config.crypto.salt)
    .update(password)
    .digest('base64');
};

const sign = (user) => {
  return jwt.sign(user, config.jwt_secret, { expiresIn: '1h' });
};

const verify = (token) => {
  return jwt.verify(token, config.jwt_secret);
};

module.exports = {
  hash,
  sign,
  verify
}
