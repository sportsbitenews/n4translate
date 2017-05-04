'use strict';
const express        = require('express');
const router         = express.Router();

const Auth           = require('./controller');
const _              = require('lodash');

router.post('/api/authenticate', (req, res) => {
  Auth.authenticate(req.body)
  .then((user) => {
    if(user) {
      let token = Auth.sign(user);
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

router.get('/api/authenticated', Auth.check, (req, res) => {
  if (!req.user) {
    res.status(401).send();
  } else {
    res.json({ authenticated: true });
  }
});

module.exports = router;
