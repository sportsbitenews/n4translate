const fs  = require("fs");
const got = require('got');
const _   = require('lodash');

const getTranslations = (config, lang = 'DE') => {
  const uri = `${config.basePathname}${config.getTranslations.pathname}`;
  const options = {
    method: config.getTranslations.method || 'GET'
  };

  return got(uri, options)
    .then((response) => {
      return JSON.parse(response.body);
    });
};

const updateSingleTranslation = (config, lang = 'DE', translation) => {
  const settings = config.updateSingleTranslation;

  const uri = `${config.basePathname}${settings.pathname}`;
  const options = {
    method: settings.method || 'GET',
    body: {},
    json: true
  };

  options.body[settings.bodyMapping.jsonPath] = translation.key;
  options.body[settings.bodyMapping.value] = translation.value;

  return got(uri, options);
};

const createTranslation = (customHttpConfig, translations, lang) => {
  const settings = customHttpConfig.createTranslations;

  const uriCompiled = _.template(`${customHttpConfig.basePathname}${settings.pathname}`);
  const uri = uriCompiled({ lang });

  const options = {
    method: settings.method || 'PUT',
    body: translations,
    json: true
  };

  return got(uri, options);
};

// const options = require('../repository/api.json');
// getTranslations(options)
//   .then((response) => {
//       let json = JSON.parse(response.body);
//       console.log(JSON.stringify(json, null, 2));
//   })
//   .catch((error) => {
//       console.log(error.response.body);
//   });

module.exports = {
  createTranslation,
  getTranslations,
  updateSingleTranslation,
}
