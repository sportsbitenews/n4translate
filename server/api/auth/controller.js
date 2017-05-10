'use strict';
const expressJwt     = require('express-jwt');
const crypto         = require('crypto');
const _              = require('lodash');

const secrets         = require('../../modules/secrets.js');

const User           = require('../user/controller');
const Auth           = require('./service');

const authenticate = ({ email, password }) => {
  return User.findByEmail(email)
    .then((user) => {
      if(user && Auth.hash(password) === user.password) {
        return _.pick(user, ['$loki', 'email', 'admin', 'meta', 'projects']);
      }
    });
};

const check = expressJwt({ secret: secrets.getJWT() });

module.exports = {
  authenticate,
  check,
  sign: Auth.sign
}
