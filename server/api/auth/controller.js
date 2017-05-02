'use strict';
const expressJwt     = require('express-jwt');

const JWT_SECRET = 'secret';
const check = expressJwt({ secret: JWT_SECRET });

const authenticate = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    if(email === 'andre@g.com' && password === '1234') {
      resolve({ name: 'andre', admin: true });
    }

    resolve(undefined);
  });
};

module.exports = {
  authenticate,
  check,
  JWT_SECRET,
}
