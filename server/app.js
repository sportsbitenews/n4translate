'use strict';
const express        = require('express');
const app            = express();

const path           = require('path');
const fs             = require('fs');

const bodyParser     = require('body-parser');
const cors           = require('cors');

const jwt            = require('jsonwebtoken');
const expressJwt     = require('express-jwt');

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
  let project = {
    $loki: _.parseInt(req.body.$loki),
    reflang: req.body.reflang
  };
  let translation =_.assign({ lang: req.body.lang }, req.file);

  Register.importTranslationToProject(project, translation)
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
    res.status(404).send();
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
    res.status(404).send();
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
    res.status(404).send();
  });
});

app.post('/api/translation', (req, res) => {
  // console.log('/api/translation', req.body.filename);

  Project.getJSON(req.body.filename)
    .then((content) => {
      res.json(content);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    });
});

app.post('/api/translation/save', (req, res) => {
  Project.saveTranslation(req.body)
    .then((content) => {
      // console.log(content);
      res.json(content);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    });
});

const authenticate = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    if(email === 'andre@g.com' && password === '1234') {
      resolve({ name: 'andre', admin: true });
    }

    resolve(undefined);
  });
};

const JWT_SECRET = 'secret';
const authCheck = expressJwt({ secret: JWT_SECRET });

app.post('/api/authenticate', (req, res) => {
  authenticate(req.body)
  .then((user) => {
    if(user) {
      let token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
      // console.log(token);

      // let decoded = jwt.verify(token, JWT_SECRET);
      // console.log(decoded);

      res.json(_.assign(user, { token }));
    } else {
      res.status(401).send();
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send();
  });
});

app.get('/api/authenticated', authCheck, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    res.json({ authenticated: true });
  }
});

const server = require('http').Server(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
