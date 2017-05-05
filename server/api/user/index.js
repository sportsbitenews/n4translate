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
    res.json(_.pick(req.user, ['$loki', 'email', 'admin']));
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
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }
});

module.exports = router;
