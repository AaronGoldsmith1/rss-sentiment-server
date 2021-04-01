const db = require('../models');


function signUp(req, res, next) {
  if (!req.body.password) {
    return res.status(422).send('Missing required fields');
  }

  db.User.create(req.body)
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully created user.',
        data: {
          name: user.name,
          id: user._id
        }
      });
    }).catch(function(err) {
      if (err.message.match(/E11000/)) {
        err.status = 409;
      } else {
        err.status = 422;
      }
      next(err);
    });
}

module.exports = {
  signUp
}