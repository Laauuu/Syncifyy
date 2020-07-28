const express = require('express');
const router = express.Router();

const validate = require('validate.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const helper = require('../../helpers/errorFunctions');

const Users = require('../../database/Models/UsersSchema');

const constraints = {
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

router.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const validationError = validate({ username, password }, constraints);
  if (validationError) {
    if (validationError.username) {
      helper.httpError400(res, validationError.username[0]);
    } else {
      helper.httpError400(res, validationError.password[0]);
    }
  } else {
    const user = await Users.findOne({ username });
    if (!user) {
      const saltRounds = 12;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        await Users.create({ username, password: hash });
        res.status(200);
        res.end();
      });
    } else {
      helper.httpError409(res, 'Username already created!');
    }
  }
});

router.post('/login', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const validationError = validate({ username, password }, constraints);
  if (validationError) {
    helper.httpError400(res, 'Username / Password is invalid.');
  } else {
    const user = await Users.findOne({ username });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          jwt.sign(
            { _id: user._id, username, lobby: user.lobby },
            process.env.TOKEN_SECRET,
            { algorithm: process.env.TOKEN_ALGO },
            (err, token) => {
              if (err) {
                helper.httpError500(res, 'Server is unstable ATM');
              } else {
                res.status(200);
                res.json({
                  token,
                });
              }
            }
          );
        } else {
          helper.httpError400(res, 'Username / Password is invalid.');
        }
      });
    } else {
      helper.httpError400(res, 'Username / Password is invalid.');
    }
  }
});

module.exports = router;
