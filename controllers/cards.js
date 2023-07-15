const Card = require('../models/card');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  return Card.create({ owner: req.user._id, name, link })
    .then((card) => { res.status(CREATED).send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка в ведённых данных' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

function deleteCard(req, res) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
