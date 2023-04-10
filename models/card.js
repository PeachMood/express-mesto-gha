const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value)
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.__v;
  return data;
}
module.exports = mongoose.model('card', cardSchema);
