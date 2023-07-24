const userRouter = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', getUser);

userRouter.post('/users', createUser);

userRouter.get('/users/me', getCurrentUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
