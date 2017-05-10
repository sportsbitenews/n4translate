'use strict';
const _ = require('lodash');

const secrets = {};

const getSecrets = () => {
  if(_.isEmpty(secrets) === false) {
    return secrets;
  } else {
    try {
      return _.assign(secrets, require('../repository/secrets.json'))
    } catch(err) {
      return secrets;
    }
  }
};

const getJWT = () => {
  return getSecrets().jwt_secret;
};

const getSalt = () => {
  return getSecrets().salt;
};


module.exports = {
  getJWT,
  getSalt,
}
