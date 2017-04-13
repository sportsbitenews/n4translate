'use strict';
const express        = require('express');
const app            = express();
const path           = require('path');
const fs             = require('fs');
const bodyParser     = require('body-parser');
const cors           = require('cors');
const multer         = require('multer');
const Loki           = require('lokijs');
const util           = require('./modules/util.js');
const _              = require('lodash');

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

const Project = require('./api/project');
const Register = require('./api/register').apply(db);

const jsonFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(json)$/)) {
    return cb(new Error('Only JSON files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  dest: `${config.upload}/`,
  fileFilter: jsonFilter
});

app.post('/api/translation/import', upload.single('i18n'), (req, res) => {
  let projectRef = { $loki: _.parseInt(req.body.$loki) };
  console.log('projectRef', projectRef);

  let translation =_.assign({ lang: 'DE' }, req.file);
  console.log('translation', translation);

  Register.importTranslationToProject(projectRef, translation)
    .then((project) => {
      res.json(project);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.get('/api/projects', (req, res) => {
  Register.getProjects()
  .then(projects => res.json(projects))
  .catch((err) => {
    console.log(err);
    res.status(404);
  });
});

app.post('/api/project/create', (req, res) => {
  let project = Project.model({
    name: req.body.name
  });

  Register.addProject(project)
  .then(project => res.json(project))
  .catch((err) => {
    console.log(err);
    res.status(404);
  });
});

app.get('/api/project/content', (req, res) => {
  Project.getJSON('de')
    .then((content) => {
      res.json(content);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
    });
});

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
