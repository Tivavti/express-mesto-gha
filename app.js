const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { auth } = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./utils/errors/notFoundError');
const error = require('./middlewares/err');
const { RegexUrl } = require('./utils/regex');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(cookies());
app.use(bodyParser.json());

mongoose.connect(DB_URL);
app.use(helmet());
app.disable('x-powered-by');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegexUrl),
  }),
}), createUser);

app.use(auth);
app.use(userRouter);
app.use(cardRouter);

app.use('/*', (_req, _res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`Application is running on ${PORT}`);
});
