'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')

const service   = require('../../modules/service');
const storage   = require('../../modules/storage.js');

const Auth      = require('../auth/service');

const COLLECTION_NAME = 'users';

const PROPERTIES = [
  '$loki',
  'email',
  'admin',
  'meta',
  'projects'
];

const project = (user) => {
  return _.pick(user, PROPERTIES);
};

const create = (user) => {
  return service.getDb()
    .then((db) => {
      user.password = Auth.hash(user.password);
      // console.log(user);
      return storage.insert(db, COLLECTION_NAME, user);
    });
};

const find = (user) => {
  return service.getDb()
    .then((db) => {
      return storage.find(db, COLLECTION_NAME, user);
    });
};

const findByEmail = (email) => {
  return service.getDb()
    .then((db) => {
      return storage.findBy(db, COLLECTION_NAME, { email });
    });
};

const getAll = () => {
  return service.getDb()
    .then((db) => {
      return storage.loadCollection(db, COLLECTION_NAME)
    })
    .then(users => _.map(users.data, project));
};

const update = (user) => {
  return service.getDb()
    .then((db) => {
      return storage.update(db, COLLECTION_NAME, user);
    });
};

module.exports = {
  create,
  find,
  findByEmail,
  getAll,
  update,
};
