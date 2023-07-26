const userRouter = require('express').Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getCurrentUser);

userRouter.patch('/users/me', updateUser);

userRouter.get('/users/:userId', getUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
