'use strict';
const User      = require('./model.js');
const _         = require('lodash');
const db        = require('../../modules/service.js').getDb();

const create = (user) => {
  return User.create(db, user);
};

const findByEmail = (email) => {
  return User.findByEmail(db, email);
};

const getAll = () => {
  return User.getAll(db);
};

module.exports = {
  create,
  findByEmail,
  getAll
};
