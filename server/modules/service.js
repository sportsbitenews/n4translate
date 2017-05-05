'use strict';
const Loki           = require('lokijs');

const db = new Loki('repository/translations/db.json');

require('./bootstrap')(db);

module.exports = {
  getDb: () => db
}
