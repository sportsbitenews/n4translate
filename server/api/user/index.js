'use strict';
const express        = require('express');
const router         = express.Router();

const Auth           = require('../auth/controller');
const User           = require('./controller');
const _              = require('lodash');

router.get('/api/user/instance', Auth.check, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    res.json(_.pick(req.user, ['$loki', 'email', 'admin', 'meta', 'projects']));
  }
});

router.get('/api/user/users', Auth.check, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    User.getAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }
});

router.post('/api/user/create', Auth.check, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    let user = _.pick(req.body, ['email']);
    user.password = 'pass';
    user.admin = false;

    User.create(user)
    .then((user) => {
      console.log('created user', user);
      res.json(_.pick(user, ['$loki', 'email', 'admin', 'meta', 'projects']));
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }
});

router.post('/api/user/admin', Auth.check, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    let $loki = req.body.$loki;
    let admin = req.body.admin || false;

    if($loki) {
      User.find({ $loki })
      .then((user) => {
        user.admin = admin;
        return User.update(user);
      })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
    } else {
      res.status(400).send();
    }
  }
});

router.post('/api/user/projects', Auth.check, (req, res) => {
  User.updateProjects(req.body)
  .then((user) => {
    // console.log('/api/user/projects: success', user);
    res.json({ success: true });
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send();
  });
});

router.post('/api/user/assign/password', Auth.check, (req, res) => {
  return User.assignPassword(req.body)
  .then((user) => {
    // console.log('/api/user/projects: success', user);
    res.json({ success: true });
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send();
  });
});

module.exports = router;
