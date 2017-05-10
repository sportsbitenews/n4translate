'use strict';
const _              = require('lodash');

const jwt            = require('jsonwebtoken');
const crypto         = require('crypto');

const config  = require('../../config.json');
const secrets    = require('../../modules/secrets');

const hash = (password) => {
  return crypto.createHash(config.crypto.algorithm, secrets.getSalt())
    .update(password)
    .digest('base64');
};

const sign = (user) => {
  return jwt.sign(user, secrets.getJWT(), { expiresIn: '1h' });
};

const verify = (token) => {
  return jwt.verify(token, secrets.getJWT());
};

module.exports = {
  hash,
  sign,
  verify
}
