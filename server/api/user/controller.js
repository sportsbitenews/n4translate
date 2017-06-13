'use strict';
const _         = require('lodash');

const Auth      = require('../auth/service.js');
const User      = require('./service.js');

const create = (user) => {
  return User.create(user);
};

const find = (user) => {
  return User.find(user);
};

const findByEmail = (email) => {
  return User.findByEmail(email);
};

const getAll = () => {
  return User.getAll();
};

const update = (user) => {
  return User.update(user);
};

const updateProjects = (client) => {
  return User.find(client)
    .then((user) => {
      _.set(user, 'projects', client.projects);
      return user;
    })
    .then(user => User.update(user));
};

const assignPassword = (client) => {
  return User.find(client)
    .then((user) => {
      let password = Auth.hash(client.newPassword);
      _.set(user, 'password', password);
      return user;
    })
    .then(user => User.update(user));
};

module.exports = {
  assignPassword,
  create,
  find,
  findByEmail,
  getAll,
  update,
  updateProjects
};
