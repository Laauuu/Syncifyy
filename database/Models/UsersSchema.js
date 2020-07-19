const mongoose = require('../connection');

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: String,
  password: String,
  lobby: {
    type: String,
    default: null,
  },
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
