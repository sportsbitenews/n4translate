'use strict';
const express        = require('express');
const app            = express();

const bodyParser     = require('body-parser');
const cors           = require('cors');

const path           = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./modules/bootstrap').initiate()
  .then(() => {
    app.use(require('./api/auth'));
    app.use(require('./api/user'));
    app.use(require('./api/register'));
  })
  .catch(console.log);

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
