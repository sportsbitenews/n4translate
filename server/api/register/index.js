'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const fs        = require('fs');
const util      = require('../../modules/util.js');

let register;

const collectionName = 'projects';

const getProjects = (db) => {
  return util.loadCollection(collectionName, db)
  .then((collection) => {
    return collection.data;
  });
};

const addProject = _.curry((db, project) => {
  return util.loadCollection(collectionName, db)
    .then((collection) => {
      const data = collection.insert(project);
      db.saveDatabase();
      return project;
    });
});

const findProjectByCollection = (collection, { $loki }) => {
  let candidates = collection
    .chain()
    .find({ $loki })
    .limit(1)
    .data();

  return _.first(candidates);
};

const importTranslationToProject = _.curry((db, { $loki, reflang }, translation) => {
  return util.loadCollection(collectionName, db)
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
});

const appendTranslationToProject = _.curry((db, { $loki, translation }) => {
  return util.loadCollection(collectionName, db)
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
});

const setReflangOfProject = _.curry((db, { $loki, reflang }) => {
  return util.loadCollection(collectionName, db)
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
});

const apply = (db) => {
  return {
    addProject: addProject(db),
    appendTranslationToProject: appendTranslationToProject(db),
    getProjects: () => getProjects(db),
    importTranslationToProject: importTranslationToProject(db),
    setReflangOfProject: setReflangOfProject(db)
  }
};

module.exports = {
  addProject,
  apply,
  appendTranslationToProject,
  getProjects,
  importTranslationToProject,
  setReflangOfProject
};
