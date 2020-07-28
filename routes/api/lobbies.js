const express = require('express');
const router = express.Router();

const helper = require('../../helpers/errorFunctions');

const Lobbies = require('../../database/Models/LobbiesSchema');

router.post('/create-lobby', async (req, res) => {
  const user = req.user;
  const lobbyName = req.body.lobbyName;
  const isPrivate = req.body.isPrivate;
  const lobbyPassword = req.body.lobbyPassword;

  const lobby = await Lobbies.findOne({ title: lobbyName });
  if (!lobby) {
    if (isPrivate) {
      Lobbies.create({
        title: lobbyName,
        owner: user.username,
        private: isPrivate,
        password: lobbyPassword,
      });
      res.status(200);
      res.end();
    } else {
      Lobbies.create({
        title: lobbyName,
        owner: user.username,
      });
      res.status(200);
      res.end();
    }
  } else {
    helper.httpError409(res, 'Lobby already exists!');
  }
});

router.get('/open-lobbies', async (req, res) => {
  const lobbies = await Lobbies.find();
  res.status(200);
  res.json(lobbies);
});

module.exports = router;
