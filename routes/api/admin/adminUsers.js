const express = require('express');
const router = express.Router();

const validate = require('validate.js');
const bcrypt = require('bcrypt');

const helper = require('../../../helpers/errorFunctions');

const Users = require('../../../database/Models/UsersSchema');

const constraints = {
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

router.get('/list-users', async (req, res) => {
  const allUsers = await Users.find();
  res.status(200);
  res.json(allUsers);
});

router.put('/change-password', (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;
  const validationError = validate({ password: newPassword }, constraints);

  if (validationError) {
    helper.httpError400(res, validationError.password[0]);
  } else {
    const saltRounds = 12;
    bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
      if (err) {
        helper.httpError400(res, 'Issue hashing password!');
      } else {
        await Users.updateOne({ _id: userId }, { password: hash });
        res.status(200);
        res.json('Successfully changed password!');
      }
    });
  }
});

router.delete('/remove-user', async (req, res) => {
  const userId = req.body.userId;

  const user = await Users.findOne({ _id: userId });
  await Users.deleteOne({ _id: userId });
  res.status(200);
  res.json(`Successfully deleted ${user.username}`);
});

module.exports = router;
