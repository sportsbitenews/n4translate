'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const storage      = require('../../modules/storage.js');

const COLLECTION_NAME = 'users';

const create = _.curry((db, user) => {
  return storage.insert(db, COLLECTION_NAME, user);
});

const find = _.curry((db, { email }) => {
  return storage.findBy(db, COLLECTION_NAME, { email });
});

const update = _.curry((db, user) => {
  return storage.update(db, COLLECTION_NAME, user);
});

module.exports = {
  create,
  update
};
