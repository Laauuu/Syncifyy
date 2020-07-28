// using mongoDB for persistent storage (database)
const mongoose = require('mongoose');

// connecting to database
mongoose.connect(
  process.env.MONGODB_URI, // mongodb URI connection
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    // if there was an error connecting
    if (err) {
      console.log("Couldn't connect to database!"); // log the message to the server
    } else {
      // connected okay
      console.log('Successfully connected to database!'); // log the message to the server
    }
  }
);

module.exports = mongoose;
