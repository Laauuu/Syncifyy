// Using Node & Express
const express = require('express');
const router = express.Router();

// Users schema for users collection in database
const Users = require('../../database/Models/UsersSchema');

// Lobbies schema for lobbies collection in database
const Lobbies = require('../../database/Models/LobbiesSchema');

// GET /lobby/user-lobby
router.get('/user-lobby', async (req, res) => {
  const userId = req.user._id; // the user sending the request

  const user = await Users.findOne({ _id: userId }); // find that user in the database
  res.status(200); // return status code 200 OK
  res.json(user.lobby); // send the client the lobby that the user is in
});

// PUT /lobby/assign-lobby
router.put('/assign-lobby', async (req, res) => {
  const userId = req.user._id; // the user sending the request
  const lobbyId = req.body.lobbyId; // the lobby the user joined

  await Users.updateOne({ _id: userId }, { lobby: lobbyId }); // update the specific user's current lobby
  res.status(200); // return status code 200 OK
  res.end(); // end
});

// PUT /lobby/change-video
router.put('/change-video', async (req, res) => {
  const lobbyId = req.body.lobbyId; // current lobby the user is in
  const newVideoId = req.body.newVideoId; // new video the user requested

  await Lobbies.updateOne({ _id: lobbyId }, { youtubeId: newVideoId }); // update the video that lobby is showing
  res.status(200); // return status code 200 OK
  res.end(); // end
});

// POST /lobby/currently-watching
router.post('/currently-watching', async (req, res) => {
  const lobbyId = req.body.lobbyId; // current lobby the user is in

  const lobby = await Lobbies.findOne({ _id: lobbyId }); // query database for the current lobby
  res.status(200); // return status code 200 OK
  res.json(lobby.youtubeId); // send the client the id of the video being watched
});

// PUT /lobby/leave-lobby
router.put('/leave-lobby', async (req, res) => {
  const userId = req.user._id; // id of the current user leaving the lobby

  await Users.updateOne({ _id: userId }, { lobby: '' }); // update the users current lobby to blank (not in any lobby)
  res.status(200); // return status code 200 OK
  res.end(); // end
});

module.exports = router;
