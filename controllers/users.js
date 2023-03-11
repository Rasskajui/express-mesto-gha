const User = require('../models/user');
const { BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  if (userId.length !== 24 || !userId.match(/[0-9a-f]{6}/g)) {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккоректный идентификатор пользователя' });
  }
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      }
      const error = new Error();
      error.name = 'CastError';
      return Promise.reject(error);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (
    !name || !about
    || name.length < 2 || name.length > 30
    || about.length < 2 || about.length > 30
  ) {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
