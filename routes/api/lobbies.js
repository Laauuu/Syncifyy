// Using Node & Express
const express = require('express');
const router = express.Router();

// helper functions for various http status code errors (400's..500s)
const helper = require('../../helpers/errorFunctions');

// Lobbies schema for lobbies collection in database
const Lobbies = require('../../database/Models/LobbiesSchema');

// POST /lobbies/create-lobby
router.post('/create-lobby', async (req, res) => {
  const user = req.user; // current user creating lobby (owner)
  const lobbyName = req.body.lobbyName; // lobby title
  const isPrivate = req.body.isPrivate; // lobby private (bool)
  const lobbyPassword = req.body.lobbyPassword; // lobby password

  const lobby = await Lobbies.findOne({ title: lobbyName }); // query database for a lobby with the same name
  if (!lobby) {
    // if there is no lobby with the same name
    if (isPrivate) {
      // if it was private
      Lobbies.create({
        // insert in database
        title: lobbyName,
        owner: user.username,
        private: isPrivate,
        password: lobbyPassword,
      });
      res.status(200);
      res.end();
    } else {
      // if it wasn't private
      Lobbies.create({
        // just insert the owner and title in the database
        title: lobbyName,
        owner: user.username,
      });
      res.status(200); // return status code 200 OK
      res.end(); // end
    }
  } else {
    // lobby with the same name was found
    helper.httpError409(res, 'Lobby already exists!'); // send according error message back to client
  }
});

// GET /lobbies/open-lobbies
router.get('/open-lobbies', async (req, res) => {
  const lobbies = await Lobbies.find(); // query database for all lobbies
  res.status(200); // return status code 200 OK
  res.json(lobbies); // send all the lobbies in the database to the client
});

module.exports = router;
