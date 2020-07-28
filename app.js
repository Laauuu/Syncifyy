const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/auth/auth');
const adminUsers = require('./routes/api/admin/adminUsers');
const adminLobbies = require('./routes/api/admin/adminLobbies');

const lobbies = require('./routes/api/lobbies');
const mainLobby = require('./routes/api/lobby');

const middlewares = require('./middlewares/middleware');

app.use(cors());
app.use(express.json());
app.use(volleyball);

app.use('/auth', auth);
app.use('/admin', middlewares.isAdmin, adminUsers);
app.use('/admin', middlewares.isAdmin, adminLobbies);
app.use('/lobbies', middlewares.isAuthorized, lobbies);
app.use('/lobby', middlewares.isAuthorized, mainLobby);

app.use('*', (req, res) => {
  const error = new Error('API endpoint not found!');
  res.status(404);
  res.json({
    error: error.message,
  });
  res.end();
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('playing', (currentLobbyId) => {
    io.emit('play', currentLobbyId);
  });
  socket.on('seek-to', (data) => {
    let currentLobbyId = data.currentLobbyId;
    let newPositionInTimeline = data.newPositionInTimeline;
    io.emit('seeking', { newPositionInTimeline, currentLobbyId });
  });
  socket.on('new-video', (currentLobbyId) => {
    io.emit('reload', currentLobbyId);
  });
  socket.on('paused', (currentLobbyId) => {
    io.emit('pause', currentLobbyId);
  });
});
