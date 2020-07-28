// Using Node & Express
const express = require('express');
const router = express.Router();

// Lobbies schema for lobbies collection in database
const Lobbies = require('../../../database/Models/LobbiesSchema');

// GET /admin/list-lobbies
router.get('/list-lobbies', async (req, res) => {
  const lobbies = await Lobbies.find(); // query database for all lobbies
  res.status(200); // return status code 200 OK
  res.json(lobbies); // send all lobbies to the client (admin)
});

// PUT /admin/change-lobby
router.put('/change-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId; // ID of lobby being changed
  const lobbyName = req.body.lobbyName; // new lobby name
  const isPrivate = req.body.isPrivate; // still private? (bool)
  const lobbyPassword = req.body.lobbyPassword; // new password

  await Lobbies.updateOne(
    // query and update document with new lobby information
    { _id: lobbyId },
    { title: lobbyName, private: isPrivate, password: lobbyPassword }
  );
  res.status(200); // return status code 200 OK
  res.json('Successfully edited lobby!'); // send success message to client
});

// DELETE /admin/delete-lobby
router.delete('/delete-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId; // ID of lobby being deleted

  const lobby = await Lobbies.findOne({ _id: lobbyId }); // query database for the lobby title that is being deleted
  await Lobbies.deleteOne({ _id: lobbyId }); // delete the document in the database
  res.status(200); // return status 200 OK
  res.json(`Successfully deleted ${lobby.title}`); // send success message to client
});

module.exports = router;
