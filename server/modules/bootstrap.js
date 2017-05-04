'use strict';
const User = require('../api/user/service');

module.exports = (db) => {
  const insertDefaultUser = () => {
    User.getAll(db)
    .then(users => users.length > 0)
    .then((hasUsers) => {
      if(hasUsers === false) {
        return User.create(db, {
          email: 'andre@g.com',
          password: '1234',
          admin: true
        });
      }
    })
    .catch(console.log);
  };

  insertDefaultUser();
}
