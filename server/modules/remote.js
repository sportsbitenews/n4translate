const fs  = require("fs");
const got = require('got');
const _   = require('lodash');

const options = require('../repository/api.json');

// console.log(options);

const getTranslations = (config, lang = 'DE') => {
  const uri = `${config.basePathname}${config.getTranslations.pathname}`;
  const options = {
    method: config.getTranslations.method || 'GET'
  };

  return got(uri, options);
};

const updateSingleTranslation = (config, lang = 'DE', translation) => {
  const settings = config.updateSingleTranslation;

  const uri = `${config.basePathname}${settings.pathname}`;
  const options = {
    method: settings.method || 'GET',
    body: {}
  };

  options.body[settings.bodyMapping.jsonPath] = translation.key;
  options.body[settings.bodyMapping.value] = translation.value;

  return got(uri, options);
}

// getTranslations(options)
//   .then((response) => {
//       console.log(response.body);
//   })
//   .catch((error) => {
//       console.log(error.response.body);
//   });

module.exports = {
  getTranslations,
  updateSingleTranslation,
}
