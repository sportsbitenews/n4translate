'use strict';
const Loki           = require('lokijs');

const config = {
  upload: 'repository/translations',
  database: 'db.json',
};

const db = new Loki(`${config.upload}/${config.database}`, {
  persistenceMethod: 'fs'
});

require('./bootstrap')(db);

module.exports = {
  getDb: () => db
}
