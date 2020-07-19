const express = require('express');
const router = express.Router();
const helper = require('../../helpers/errorFunctions');

const Users = require('../../database/Models/UsersSchema');

const validate = require('validate.js'); // validation package
const jwt = require('jsonwebtoken'); // JWT
const bcrypt = require('bcrypt'); // hashing package
const saltRounds = 12; // salt level

const constraints = {
  // simple validation
  username: {
    presence: true,
    length: {
      minimum: 4,
      message: 'must be at least 4 characters!',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const validationError = validate({ username, password }, constraints);
  if (validationError) {
    if (validationError.username) {
      helper.httpError400(res, validationError.username[0]);
    } else {
      helper.httpError400(res, validationError.password[0]);
    }
    return;
  }
  Users.findOne({ username }).then((err, user) => {
    if (!user) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        Users.create({ username, password: hash }).then((err) => {
          if (err) {
            helper.httpError500(res, 'Server is unstable ATM');
          }
        });
      });
    } else if (user) {
      helper.httpError409(res, 'Username already created!');
    } else if (err) {
      helper.httpError500(res, 'Server is unstable ATM');
    }
  });
});

router.get('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const validationError = validate({ username, password }, constraints);
  if (validationError) {
    helper.httpError400(res, 'Username / Password is invalid.');
    return;
  }
  Users.findOne({ username }).then((user, err) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          jwt.sign(
            { _id: user._id, username, lobby: user.lobby },
            process.env.TOKEN_SECRET,
            { algorithm: process.env.TOKEN_ALGO },
            (err, token) => {
              if (err) {
                helper.httpError500(res, 'Server is unstable ATM'); // change
              } else {
                res.json(token);
              }
            }
          );
        } else if (!result) {
          helper.httpError400(res, 'Username / Password is invalid.');
        } else if (err) {
          helper.httpError500(res, 'Server is unstable ATM');
        }
      });
    } else if (!user) {
      helper.httpError400(res, 'Username / Password is invalid.');
    } else if (err) {
      helper.httpError500(res, 'Server is unstable ATM');
    }
  });
});

module.exports = router;
