'use strict';
const Promise  = require('bluebird')

const insert = (db, name, item) => {
  return loadCollection(name, db)
    .then((collection) => {
      const data = collection.insert(item);
      db.saveDatabase();
      return item;
    });
};

const find = (db, name, { $loki }) => {
  return loadCollection(name, db)
    .then((collection) => {
      let candidates = collection
        .chain()
        .find({ $loki })
        .limit(1)
        .data();

      return _.first(candidates);
    });
};

const findBy = (db, name, needle) => {
  return loadCollection(name, db)
    .then((collection) => {
      let candidates = collection
        .chain()
        .find(needle)
        .limit(1)
        .data();

      return _.first(candidates);
    });
};

const update = (db, name, item) => {
  return loadCollection(db, name)
    .then((collection) => {
      collection.update(item);
      db.saveDatabase();

      return itme;
    });
};

const loadCollection = (db, name) => {
  return new Promise((resolve, reject) => {
    db.loadDatabase({}, () => {
      const collection = db.getCollection(name) || db.addCollection(name);
      resolve(collection);
    })
  });
};

module.exports = {
  find,
  insert,
  loadCollection,
  update
}
