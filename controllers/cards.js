const Card = require('../models/card');

const {
  OK,
  CREATED,
} = require('../utils/status');

const InternalServerError = require('../utils/errors/internalServerError');
const NotFoundError = require('../utils/errors/notFoundError');
const BadRequestError = require('../utils/errors/badRequestError');

function getCards(_req, res, next) {
  return Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => next(new InternalServerError('Произошла ошибка')));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  return Card.create({ owner: req.user._id, name, link })
    .then((card) => { res.status(CREATED).send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function deleteCard(req, res, next) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
