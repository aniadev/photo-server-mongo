const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: `${uuid()}`,
  },
  data: {
    type: String,
    required: true,
  },
  creatAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('photo_sv1', PhotoSchema);
