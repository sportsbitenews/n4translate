'use strict';
const Promise  = require('bluebird')
const fs       = Promise.promisifyAll(require('fs-extra'));

const readFile = (filepath, options = 'utf8') => {
  return fs.readFileAsync(filepath, options);
};

const outputFile = (filepath, data, options) => {
  return fs.outputFileAsync(filepath, data, options);
};

const readJSON = (filepath) => {
  return fs.readJsonAsync(filepath);
};

const outputJson = (filepath, data) => {
  return fs.outputJsonAsync(filepath, data);
};

const writeJson = (filepath, data) => {
  return fs.writeJsonAsync(filepath, data);
};

const exists = (filepath) => {
  return fs.existsSync(filepath);
}

const loadCollection = (name, db) => {
  return new Promise((resolve, reject) => {
    db.loadDatabase({}, () => {
      const collection = db.getCollection(name) || db.addCollection(name);
      resolve(collection);
    })
  });
};

module.exports = {
  exists,
  loadCollection,
  outputFile,
  outputJson,
  readFile,
  readJSON,
  writeJson
}
