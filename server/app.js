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
  let translation =_.assign({ lang: req.body.lang }, req.file);

  Register.importTranslationToProject(projectRef, translation)
    .then((project) => {
      res.json(project);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post('/api/translation/append', (req, res) => {
  let $loki = _.parseInt(req.body.$loki);
  let translation = req.body.translation;

  // console.log({
  //   $loki,
  //   translation,
  //   filename: translation.filename,
  //   content: req.body.content
  // });

  Project.saveTranslation({
    filename: translation.filename,
    content: req.body.content
  })
  .then(() => {
    return Register.appendTranslationToProject({ $loki, translation });
  })
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

app.post('/api/project/reflang', (req, res) => {
  let options = {
    $loki: _.parseInt(req.body.$loki),
    reflang: req.body.reflang
  };

  Register.setReflangOfProject(options)
  .then(project => res.json(project))
  .catch((err) => {
    console.log(err);
    res.status(404);
  });
});

app.post('/api/translation', (req, res) => {
  Project.getJSON(req.body.filename)
    .then((content) => {
      res.json(content);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
    });
});

app.post('/api/translation/save', (req, res) => {
  Project.saveTranslation(req.body)
    .then((content) => {
      console.log(content);
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
