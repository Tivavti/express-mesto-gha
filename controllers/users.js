const User = require('../models/user');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' }));
}

function getUser(req, res) {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(OK).send(user);
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' }));
}

function createUser(req, res) {
  return User.create({ ...req.body })
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка в ведённых данных' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка в ведённых данных' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка в ведённых данных' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка' });
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
