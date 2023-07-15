const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },

  link: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Поле "users" должно быть заполнено'],
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: '',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
