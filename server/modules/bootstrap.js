'use strict';
const Promise  = require('bluebird')
const crypto    = require('crypto');
const util      = require('./util');

const config    = require('../config.json');
const User      = require('../api/user/service');

const createHash = () => {
  return crypto.randomBytes(64).toString('hex');
};

const ensureHashSecrets = () => {
  let filepath = `${__dirname}/../repository/secrets.json`;

  return new Promise((resolve, reject) => {
    if(util.exists(filepath)) {
      resolve(true);
    } else {
      return util.writeJson(filepath, {
        salt: createHash(),
        jwt_secret: createHash()
      })
      .then(() => resolve(true))
      .catch(err => reject(err));
    }
  });
};

const insertDefaultUser = () => {
  return User.getAll()
  .then(users => users.length > 0)
  .then((hasUsers) => {
    if(hasUsers === false) {
      return User.create(require('../default.user.json'));
    }
  })
  .catch(console.log);
};

module.exports = {
  initiate: () => {
    return ensureHashSecrets()
      .then(() => insertDefaultUser());
  }
};
