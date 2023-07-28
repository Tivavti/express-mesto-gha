const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  OK,
  CREATED,
} = require('../utils/status');

const UnauthorizedError = require('../utils/errors/unauthorizedError');
const InternalServerError = require('../utils/errors/internalServerError');
const NotFoundError = require('../utils/errors/notFoundError');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');

const { generateToken } = require('../utils/token');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const payload = { _id: user._id, email: user.email };
    const token = generateToken(payload);
    res.cookie('jwt', token);
    return res.status(OK).send(payload);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

function getUsers(_req, res, next) {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => next(new InternalServerError('Произошла ошибка')));
}

function getUser(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function getCurrentUser(req, res, next) {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
}

module.exports = {
  login,
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
};
