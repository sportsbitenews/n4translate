'use strict';
const express        = require('express');
const app            = express();

const bodyParser     = require('body-parser');
const cors           = require('cors');

const Loki           = require('lokijs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
  upload: 'repository/translations',
  database: 'db.json',
};

const db = new Loki(`${config.upload}/${config.database}`, {
  persistenceMethod: 'fs'
});

require('./api/auth')({
  app,
  db
});

const Project = require('./api/project');
const Register = require('./api/register/controller').apply(db);
const Auth = require('./api/auth/controller');

require('./api/register')({
  app,
  Auth,
  Project,
  Register
});

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
