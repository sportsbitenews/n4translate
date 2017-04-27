'use strict';
const util      = require('../../modules/util.js');
const _         = require('lodash');
const Promise   = require('bluebird')

const getFilepath = (filename) => {
  return `repository/translations/${filename}`;
};

const getJSON = (filename) => {
  let filepath = getFilepath(filename);
  return util.readJSON(filepath);
};

const saveEntity = (filename, { path, value }) => {
  return getJSON(filename)
    .then((json) => {
      _.set(json, path, value);

      let filepath = getFilepath(filename);
      return util.outputFile(filepath, json);
    });
};

const model = ({ name }) => {
  return {
    name,
    filename: _.kebabCase(name),
    translations: []
  }
};

const createTranslation = (project, lang) => {
  let filepath = getFilepath(`${project.filename}-${lang}`);
  return util.outputFile(filepath, translation.content);
}

const saveTranslation = (translation) => {
  let filepath = getFilepath(translation.filename);
  return util.writeJson(filepath, translation.content);
}

module.exports = {
  getJSON,
  model,
  saveEntity,
  createTranslation,
  saveTranslation
};
