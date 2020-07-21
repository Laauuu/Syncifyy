const express = require('express');
const app = express();

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
