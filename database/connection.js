const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Couldn't connect to database!");
    } else {
      console.log('Successfully connected to database!');
    }
  }
);

module.exports = mongoose;
