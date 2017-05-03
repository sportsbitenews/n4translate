'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const fs        = require('fs');

const storage   = require('../../modules/storage.js');
const db        = require('../../modules/service.js').getDb();

const COLLECTION_NAME = 'projects';

const getProjects = () => {
  return storage.loadCollection(db, COLLECTION_NAME)
  .then((collection) => {
    return collection.data;
  });
};

const addProject = (project) => {
  return storage.insert(db, COLLECTION_NAME, project);
};

const findProjectByCollection = (collection, { $loki }) => {
  let candidates = collection
    .chain()
    .find({ $loki })
    .limit(1)
    .data();

  return _.first(candidates);
};

const importTranslationToProject = ({ $loki, reflang }, translation) => {
  return storage.loadCollection(db, COLLECTION_NAME)
  .then((collection) => {
    let project = findProjectByCollection(collection, { $loki });

    if(project) {
      let translations = _.get(project, 'translations', []);

      translations.push(translation);
      _.set(project, 'translations', translations);

      if(reflang) {
        _.set(project, 'reflang', reflang);
      }

      collection.update(project);
      db.saveDatabase();
    }

    return project;
  });
};

const appendTranslationToProject = ({ $loki, translation }) => {
  return storage.loadCollection(db, COLLECTION_NAME)
  .then((collection) => {
    let project = findProjectByCollection(collection, { $loki });

    if(project) {
      let translations = _.get(project, 'translations', []);

      translations.push(translation);
      _.set(project, 'translations', translations);

      collection.update(project);
      db.saveDatabase();
    }

    return project;
  });
};

const setReflangOfProject = ({ $loki, reflang }) => {
  return storage.loadCollection(db, COLLECTION_NAME)
  .then((collection) => {
    let project = findProjectByCollection(collection, { $loki });

    if(project) {
      let translations = _.get(project, 'translations', []);

      _.set(project, 'reflang', reflang);

      collection.update(project);
      db.saveDatabase();
    }

    return project;
  });
};

module.exports = {
  addProject,
  appendTranslationToProject,
  getProjects,
  importTranslationToProject,
  setReflangOfProject
};
