const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '640a11d46b27e8f665909e14',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res, next) => {
  res.send({ message: 'Неправильный путь' });
  next();
});

app.listen(PORT);
