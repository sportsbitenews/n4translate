'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const fs        = require('fs');

const service   = require('../../modules/service');
const storage   = require('../../modules/storage');
const remote    = require('../../modules/remote');

const COLLECTION_NAME = 'projects';

const getProjects = () => {
  return service.getDb()
    .then((db) => {
      return storage.loadCollection(db, COLLECTION_NAME);
    })
    .then((collection) => {
      return collection.data;
    })
    .then((projects) => {
      return _.map(projects, prepareCustomHttpTranslations);
    });
};

const prepareCustomHttpTranslations = (project) => {
  if(_.has(project, 'customHttpConnector')) {
    project.translations = _
      .chain(_.get(project, 'customHttpConnector.translations', []))
      .map((translation) => {
        return {
          lang: translation.lang,
          customHttpConnector: true,
          $loki: project.$loki
        };
      })
      .value();

    return project;
  }

  return project;
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

const saveCustomHttpConfig = (project, customHttpConnector) => {
  return setCustomHttpConnector({
    $loki: project.$loki,
    customHttpConnector
  });
};

const getCustomTranslation = ({ $loki, lang, customHttpConnector }) => {
  return getCustomHttpConfig({ $loki, lang })
    .then((customHttpConfig) => {
      if(customHttpConfig) {
        return remote.getTranslations(customHttpConfig, lang);
      }
    });
};

const getCustomHttpConfig = ({ $loki, lang }) => {
  let db;
  return service.getDb()
    .then((dbInstance) => {
      db = dbInstance;
      return storage.loadCollection(db, COLLECTION_NAME)
    })
    .then((collection) => {
      let project = findProjectByCollection(collection, { $loki });

      if(_.has(project, 'customHttpConnector.translations')) {
        const customHttpConnector = project.customHttpConnector;

        const customHttpConfig = Object.assign({}, _.find(customHttpConnector.translations, { lang }));
        _.set(customHttpConfig, 'basePathname', customHttpConnector.basePathname);

        return customHttpConfig;
      }
    });
}

const saveCustomEntity = ({ $loki, lang, property }) => {
  return getCustomHttpConfig({ $loki, lang })
    .then((customHttpConfig) => {
      // console.log(customHttpConfig, lang, property);
      if(customHttpConfig) {
        return remote.updateSingleTranslation(customHttpConfig, lang, property);
      }
    });
};

module.exports = {
  addProject,
  appendTranslationToProject,
  getCustomTranslation,
  getProjects,
  importTranslationToProject,
  removeTranslationFromProject,
  setReflangOfProject,
  saveCustomEntity,
  saveCustomHttpConfig,
  setCustomHttpConnector
};
