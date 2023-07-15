const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

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
  res.status(NOT_FOUND).json({ massage: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Application is running on ${PORT}`);
});
