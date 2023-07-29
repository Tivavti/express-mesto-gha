const Card = require('../models/card');

const {
  OK,
  CREATED,
} = require('../utils/status');

const NotFoundError = require('../utils/errors/notFoundError');
const BadRequestError = require('../utils/errors/badRequestError');
const ForbiddenError = require('../utils/errors/forbiddenError');

function getCards(_req, res, next) {
  return Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  return Card.create({ owner: req.user._id, name, link })
    .then((card) => { res.status(CREATED).send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

function deleteCard(req, res, next) {
  return Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner._id.toString() !== req.user._id) {
        throw (new ForbiddenError('Доступ запрещён'));
      }
      return Card.deleteOne(card);
    })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
