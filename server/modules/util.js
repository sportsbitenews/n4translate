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

const removeFile = (filepath) => {
  return fs.removeAsync(filepath);
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

module.exports = {
  exists,
  outputFile,
  outputJson,
  readFile,
  readJSON,
  removeFile,
  writeJson
}
