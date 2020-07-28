const express = require('express');
const router = express.Router();

const helper = require('../../helpers/errorFunctions');

const Users = require('../../database/Models/UsersSchema');
const Lobbies = require('../../database/Models/LobbiesSchema');

router.get('/user-lobby', async (req, res) => {
  const userId = req.user._id;
  const user = await Users.findOne({ _id: userId });

  res.status(200);
  res.json(user.lobby);
});

router.put('/assign-lobby', async (req, res) => {
  const userId = req.user._id;
  const lobbyId = req.body.lobbyId;

  await Users.updateOne({ _id: userId }, { lobby: lobbyId });
  res.status(200);
  res.end();
});

router.put('/change-video', async (req, res) => {
  const lobbyId = req.body.lobbyId;
  const newVideoId = req.body.newVideoId;

  await Lobbies.updateOne({ _id: lobbyId }, { youtubeId: newVideoId });
  res.status(200);
  res.end();
});

router.post('/currently-watching', async (req, res) => {
  const lobbyId = req.body.lobbyId;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  res.status(200);
  res.json(lobby.youtubeId);
});

router.put('/leave-lobby', async (req, res) => {
  const userId = req.user._id;

  await Users.updateOne({ _id: userId }, { lobby: '' });
  res.status(200);
  res.end();
});

module.exports = router;
