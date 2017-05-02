'use strict';
const jwt            = require('jsonwebtoken');
const Auth           = require('./controller.js');
const _              = require('lodash');

module.exports = ({ app, db }) => {
  app.post('/api/authenticate', (req, res) => {
    Auth.authenticate(req.body)
    .then((user) => {
      if(user) {
        let token = jwt.sign(user, Auth.JWT_SECRET, { expiresIn: '1h' });
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

  app.get('/api/authenticated', Auth.check, (req, res) => {
    if (!req.user) {
      res.status(401).send();
    } else {
      res.json({ authenticated: true });
    }
  });
}
