const express = require('express');
const router = express.Router();

const helper = require('../../../helpers/errorFunctions');

const Lobbies = require('../../../database/Models/LobbiesSchema');

router.get('/list-lobbies', async (req, res) => {
  const lobbies = await Lobbies.find();
  res.status(200);
  res.json(lobbies);
});

router.put('/change-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId;
  const lobbyName = req.body.lobbyName;
  const isPrivate = req.body.isPrivate;
  const lobbyPassword = req.body.lobbyPassword;

  await Lobbies.updateOne(
    { _id: lobbyId },
    { title: lobbyName, private: isPrivate, password: lobbyPassword }
  );
  res.status(200);
  res.json('Successfully edited lobby!');
  res.end();
});

router.delete('/delete-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  await Lobbies.deleteOne({ _id: lobbyId });
  res.status(200);
  res.json(`Successfully deleted ${lobby.title}`);
});

module.exports = router;
