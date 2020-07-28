const mongoose = require('../connection');

const Schema = mongoose.Schema;

const LobbiesSchema = new Schema({
  title: String,
  owner: String,
  private: {
    type: String,
    default: false,
  },
  password: {
    type: String,
    default: null,
  },
  youtubeId: {
    type: String,
    default: 'MtN1YnoL46Q',
  },
});

const Lobbies = mongoose.model('Lobbies', LobbiesSchema);

module.exports = Lobbies;
