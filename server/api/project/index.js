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

const saveEntity = ({ filename, property }) => {
  return getJSON(filename)
    .then((json) => {
      _.set(json, property.key, property.value);

      let filepath = getFilepath(filename);
      return util.writeJson(filepath, json);
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
};

const saveTranslation = (translation) => {
  let filepath = getFilepath(translation.filename);
  return util.writeJson(filepath, translation.content);
};

const removeTranslation = (translation) => {
  let filepath = getFilepath(translation.filename);
  return util.removeFile(filepath);
};

const saveCustomHttpConfig = (config) => {

};

module.exports = {
  createTranslation,
  getJSON,
  model,
  removeTranslation,
  saveCustomHttpConfig,
  saveEntity,
  saveTranslation,
};
