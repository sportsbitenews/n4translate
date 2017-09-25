'use strict';
const express        = require('express');
const router         = express.Router();

const multer         = require('multer');
const _              = require('lodash');

const Project = require('../project');
const Register = require('./controller');
const Auth = require('../auth/controller');

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

router.post('/api/translation/import', [Auth.check, upload.single('i18n')], (req, res) => {
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

router.post('/api/translation/append', Auth.check, (req, res) => {
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

router.get('/api/projects', Auth.check, (req, res) => {
  Register.getProjects()
  .then((projects) => {
    res.json(projects);
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send();
  });
});

router.post('/api/project/create', Auth.check, (req, res) => {
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

router.post('/api/project/reflang', Auth.check, (req, res) => {
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

router.post('/api/translation', Auth.check, (req, res) => {
  if(req.body.filename) {
    Project.getJSON(req.body.filename)
      .then((content) => {
        res.json(content);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send();
      });
  } else {
    Register.getCustomTranslation(req.body)
      .then((content) => {
        res.json(content);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send();
      });
  }
});

router.post('/api/translation/save', Auth.check, (req, res) => {
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

router.post('/api/translation/property/save', Auth.check, (req, res) => {
  if(req.body.filename) {
    Project.saveEntity(req.body)
      .then((content) => {
        res.json(content);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send();
      });
  } else {
    Register.saveCustomEntity(req.body)
      .then((content) => {
        console.log(content.body);
        res.json({
          succesful: true,
          response: content.body
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send();
      });
  }
});

router.post('/api/translation/remove', Auth.check, (req, res) => {
  Project.removeTranslation(req.body.translation)
    .then(() => {
      return Register.removeTranslationFromProject(req.body);
    })
    .then((project) => {
      // console.log(project);
      res.json(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    });
});

router.post('/api/project/enableCustomHttp', Auth.check, (req, res) => {
  const { project, customHttpConnector } = req.body;

  Register.saveCustomHttpConfig(project, customHttpConnector)
    .then((project) => {
      console.log(project);
      res.json(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    });
});

module.exports = router;
