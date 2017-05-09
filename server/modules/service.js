'use strict';
const Loki           = require('lokijs');

const db = new Loki('repository/translations/db.json');

module.exports = {
  getDb: () => db
}
