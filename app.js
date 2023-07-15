const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL);
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b2970f175ebb505707b4f2',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Application is running on ${PORT}`);
});
