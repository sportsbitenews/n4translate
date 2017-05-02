'use strict';
const multer         = require('multer');
const _              = require('lodash');

const config = {
  upload: 'repository/translations'
};

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

module.exports = ({
  app,
  Auth,
  Project,
  Register
}) => {
  app.post('/api/translation/import', [Auth.check, upload.single('i18n')], (req, res) => {
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

  app.post('/api/translation/append', Auth.check, (req, res) => {
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

  app.get('/api/projects', Auth.check, (req, res) => {
    Register.getProjects()
    .then(projects => res.json(projects))
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    });
  });

  app.post('/api/project/create', Auth.check, (req, res) => {
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

  app.post('/api/project/reflang', Auth.check, (req, res) => {
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

  app.post('/api/translation', Auth.check, (req, res) => {
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

  app.post('/api/translation/save', Auth.check, (req, res) => {
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
}
