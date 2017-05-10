'use strict';
const express        = require('express');
const app            = express();
const path           = require('path');

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

const server = require('http').Server(app);

server.listen(4000, () => {
  console.log('listening on *:4000');
});
