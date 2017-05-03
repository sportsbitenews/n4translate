'use strict';
const _              = require('lodash');
const Promise        = require('bluebird');
const Loki           = require('lokijs');

const config = {
  upload: 'repository/translations',
  database: 'db.json',
};

const db = new Loki(`${config.upload}/${config.database}`, {
  persistenceMethod: 'fs'
});

const User = require('./api/user/controller');

User.create({ email: 'andre@g.com', password: '1234'})
  .then((user) => {
    console.log('created user', user);

    // User.getAll()
    //   .then((users) => {
    //     console.log('users', users.data);
    //   })
    //   .catch(console.log);
  })
  .catch(console.log);
