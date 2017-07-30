'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const fs        = require('fs');

const service   = require('../../modules/service');
const storage   = require('../../modules/storage');

const COLLECTION_NAME = 'projects';

const getProjects = () => {
  return service.getDb()
    .then((db) => {
      return storage.loadCollection(db, COLLECTION_NAME);
    })
    .then((collection) => {
      return collection.data;
    });
};

const addProject = (project) => {
  return service.getDb()
    .then((db) => {
      return storage.insert(db, COLLECTION_NAME, project);
    });
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
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME);
    })
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
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME)
    })
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

const removeTranslationFromProject = ({ $loki, translation }) => {
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME)
    })
    .then((collection) => {
      let project = findProjectByCollection(collection, { $loki });

      if(project) {
        let translations = _.get(project, 'translations', []);

        let filename = _.get(translation, 'filename');
        if(filename) {
          let index = _.findIndex(translations, { filename });
          if(index > -1) {
            translations.splice(index, 1);
            _.set(project, 'translations', translations);
            collection.update(project);
            db.saveDatabase();
          }
        }
      }

      return project;
    });
};

const setReflangOfProject = ({ $loki, reflang }) => {
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME)
    })
    .then((collection) => {
      let project = findProjectByCollection(collection, { $loki });

      if(project) {
        _.set(project, 'reflang', reflang);

        collection.update(project);
        db.saveDatabase();
      }

      return project;
    });
};

const setCustomHttpConnector = ({ $loki, customHttpConnector }) => {
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME)
    })
    .then((collection) => {
      let project = findProjectByCollection(collection, { $loki });

      if(project) {
        _.set(project, 'customHttpConnector', customHttpConnector);

        collection.update(project);
        db.saveDatabase();
      }

      return project;
    });
}

module.exports = {
  addProject,
  appendTranslationToProject,
  getProjects,
  importTranslationToProject,
  removeTranslationFromProject,
  setReflangOfProject,
  setCustomHttpConnector
};
