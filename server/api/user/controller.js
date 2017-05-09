'use strict';
const _         = require('lodash');

const User      = require('./service.js');
const db        = require('../../modules/service.js').getDb();

const create = (user) => {
  return User.create(db, user);
};

const find = (user) => {
  return User.find(db, user);
};

const findByEmail = (email) => {
  return User.findByEmail(db, email);
};

const getAll = () => {
  return User.getAll(db);
};

const update = (user) => {
  return User.update(db, user);
};

const updateProjects = (client) => {
  return User.find(db, client)
    .then((user) => {
      _.set(user, 'projects', client.projects);
      return user;
    })
    .then(user => User.update(db, user));
};

module.exports = {
  create,
  find,
  findByEmail,
  getAll,
  update,
  updateProjects
};
