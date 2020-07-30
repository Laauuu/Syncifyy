// Using Node & Express
const express = require('express');
const router = express.Router();

// Users model for users collection in database
const Users = require('../../database/Models/UsersModel');

// Lobbies model for lobbies collection in database
const Lobbies = require('../../database/Models/LobbiesModel');

// GET /lobby/user-lobby
router.get('/user-lobby', async (req, res) => {
  const userId = req.user.id; // the user sending the request

  const user = await Users.findOne({ id: userId }); // find that user in the database
  res.status(200); // return status code 200 OK
  res.json(user.lobby); // send the client the lobby that the user is in
});

// PUT /lobby/assign-lobby
router.put('/assign-lobby', async (req, res) => {
  const userId = req.user.id; // the user sending the request
  const lobbyId = req.body.lobbyId; // the lobby the user joined

  const updated = await Users.update(
    { lobby: lobbyId },
    { where: { id: userId } }
  ); // update the specific user's current lobby
  res.status(200); // return status code 200 OK
  res.end(); // end
});

// PUT /lobby/change-video
router.put('/change-video', async (req, res) => {
  const lobbyId = req.body.lobbyId; // current lobby the user is in
  const newVideoId = req.body.newVideoId; // new video the user requested

  const updated = await Lobbies.update(
    { youtubeId: newVideoId },
    {
      where: {
        uuid: lobbyId,
      },
    }
  ); // update the video that lobby is showing
  res.status(200); // return status code 200 OK
  res.end(); // end
});

// POST /lobby/currently-watching
router.post('/currently-watching', async (req, res) => {
  const lobbyId = req.body.lobbyId; // current lobby the user is in

  const lobby = await Lobbies.findOne({ where: { uuid: lobbyId } }); // query database for the current lobby
  res.status(200); // return status code 200 OK
  res.json(lobby.youtubeId); // send the client the id of the video being watched
});

// PUT /lobby/leave-lobby
router.put('/leave-lobby', async (req, res) => {
  const userId = req.user.id; // id of the current user leaving the lobby

  const updated = await Users.update(
    { lobby: '' },
    {
      where: {
        id: userId,
      },
    }
  ); // update the users current lobby to blank (not in any lobby)
  res.status(200); // return status code 200 OK
  res.end(); // end
});

module.exports = router;
