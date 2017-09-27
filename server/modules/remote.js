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
  const settings = customHttpConfig.createTranslations.createOptions;

  const uriCompiled = _.template(`${customHttpConfig.basePathname}${settings.pathname}`);
  const uri = uriCompiled({ lang });

  const options = {
    method: settings.method || 'PUT',
    body: translations,
    json: true
  };

  return got(uri, options)
    .then(() => {
      return createTranslationConfig(customHttpConfig.createTranslations, lang);
    });
};

const createTranslationConfig = (createTranslations, lang) => {
  if(!createTranslations) return null;

  const config = { lang };

  _.forOwn(createTranslations.rest, (options, type) => {
    let optionsAsString = JSON.stringify(options);
    const compiled = _.template(optionsAsString);
    optionsAsString = compiled({ lang });

    _.set(config, type, JSON.parse(optionsAsString));
  });

  return config;
};

module.exports = {
  createTranslationConfig,
  createTranslation,
  getTranslations,
  updateSingleTranslation,
}
