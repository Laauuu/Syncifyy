const express = require('express');
const router = express.Router();

const helper = require('../../helpers/errorFunctions');

const Lobbies = require('../../database/Models/LobbiesSchema');

router.post('/create-lobby', (req, res) => {
  const user = req.user;
  const lobbyName = req.body.lobbyName;
  const isPrivate = req.body.isPrivate;
  const lobbyPassword = req.body.lobbyPassword;
  Lobbies.findOne({ title: lobbyName }).then((lobby, err) => {
    if (!lobby) {
      if (isPrivate) {
        Lobbies.create({
          title: lobbyName,
          owner: user.username,
          private: isPrivate,
          password: lobbyPassword,
        });
        res.end();
      } else {
        Lobbies.create({
          title: lobbyName,
          owner: user.username,
        });
        res.end();
      }
    } else if (lobby) {
      helper.httpError409(res, 'Lobby already exists!');
    } else if (err) {
      helper.httpError500(res, 'Server is unstable ATM');
    }
  });
});

router.get('/open-lobbies', (req, res) => {
  Lobbies.find().then((lobbies, err) => {
    if (err) {
      helper.httpError500(res, 'Server is unstable ATM');
    } else {
      res.json(lobbies);
    }
  });
});

module.exports = router;
