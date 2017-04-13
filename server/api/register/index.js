'use strict';
const _         = require('lodash');
const Promise   = require('bluebird')
const fs        = require('fs');
const util      = require('../../modules/util.js');

let registerPath = `repository/config/register.json`;
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

const importTranslationToProject = _.curry((db, { $loki }, translation) => {
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

const apply = (db) => {
  return {
    addProject: addProject(db),
    getProjects: () => getProjects(db),
    importTranslationToProject: importTranslationToProject(db)
  }
};

module.exports = {
  apply,
  addProject,
  getProjects,
  importTranslationToProject
};

// const addLang = _.curry((db, { $loki }, lang) => {
//   return util.loadCollection(collectionName, db)
//   .then((collection) => {
//     let project = findProjectByCollection(collection, { $loki });
//
//     if(project) {
//       let langs = _.get(project, 'langs', []);
//
//       if(_.includes(langs, lang) === false) {
//         langs.push(lang);
//         _.set(project, 'langs', langs);
//
//         collection.update(project);
//         db.saveDatabase();
//       }
//     }
//
//     return project;
//   });
// });
