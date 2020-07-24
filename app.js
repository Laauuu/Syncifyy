const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/auth/auth'); // auth file
const lobbies = require('./routes/api/lobbies'); // lobbies file
const middlewares = require('./middlewares/middleware'); // custom middlewares

app.use(cors()); // opening server to accept requests from frontend
app.use(express.json()); // parse body
app.use(volleyball); // log the AJAX request

app.use('/auth', auth); // auth endpoints (login / register)
app.use(middlewares.isAuthorized); // ensures user is valid
app.use('/lobbies', lobbies); // lobby endpoints

app.use('*', (req, res) => {
  // endpoint not found
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
let connected = 0; // amount of users connected
let connectedArr = [];

io.on('connection', (socket) => {
  socket.on('new-auth-client', () => {
    // user connected to server
    io.emit('new-connection');
  });
  socket.on('current-users', (data) => {
    // connected = total number of people currently on server
    if (data.totalUsers > connected) {
      connected = data.totalUsers;
    }
    io.emit('currently-online', { connected });
  });
  socket.on('logout', () => {
    connected -= 1;
    connectedArr.push(socket.id); // stores the user who disconnected in the array
    io.emit('lost-connection');
  });
  socket.on('disconnect', () => {
    let found = false;
    let index;
    for (var i = 0; i < connectedArr.length; i++) {
      // iterates through the array
      if (connectedArr[i] == socket.id) {
        // if user already logged out
        found = true;
        index = i;
      }
    }
    if (!found) {
      // if they disconnect without logging out -1 from connected and emit change to frontend
      if (connected != 0) {
        connected -= 1;
        io.emit('lost-connection');
      }
    } else {
      // already disconnected, can remove from the array
      connectedArr.splice(index, 1);
    }
  });
});
