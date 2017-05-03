'use strict';
const express        = require('express');
const app            = express();

const bodyParser     = require('body-parser');
const cors           = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./api/auth'));
app.use(require('./api/register'));

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
