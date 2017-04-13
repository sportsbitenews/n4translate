'use strict';
const util      = require('../../modules/util.js');
const _         = require('lodash');
const Promise   = require('bluebird')

const getFilepath = (filename) => {
  return `repository/${filename}.json`;
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
    refLang: 'DE',
    translations: []
  }
};

module.exports = {
  getJSON,
  model,
  saveEntity
};
