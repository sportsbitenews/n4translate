'use strict';
const express        = require('express');
const app            = express();

const bodyParser     = require('body-parser');
const cors           = require('cors');

const path           = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const env = process.argv[2] || 'dev';
// console.log(process.argv);

if(env === 'prod') {
  console.log('static file hosting');
  app.use('/', express.static(path.resolve(__dirname, '../client/dist')));
}

const db = require('./modules/service').getDb();
const bootstrap = require('./modules/bootstrap');

bootstrap.ensureHashSecrets()
.then(() => {
  db.loadDatabase({}, () => {
    bootstrap.insertDefaultUser(db);

    app.use(require('./api/auth'));
    app.use(require('./api/user'));
    app.use(require('./api/register'));
  });
});

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
