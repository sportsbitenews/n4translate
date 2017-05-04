'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const storage   = require('../../modules/storage.js');

const Auth      = require('../auth/controller');

const COLLECTION_NAME = 'users';

const PROPERTIES = [
  '$loki',
  'email',
  'admin',
  'meta'
];

const project = (user) => {
  return _.pick(user, PROPERTIES);
};

const create = _.curry((db, user) => {
  user.password = Auth.hash(user.password);
  return storage.insert(db, COLLECTION_NAME, user);
});

const findByEmail = _.curry((db, email) => {
  return storage.findBy(db, COLLECTION_NAME, { email });
});

const getAll = _.curry((db) => {
  return storage.loadCollection(db, COLLECTION_NAME)
    .then(users => _.map(users.data, project));
});

const update = _.curry((db, user) => {
  return storage.update(db, COLLECTION_NAME, user);
});

module.exports = {
  create,
  findByEmail,
  getAll,
  update,
};
