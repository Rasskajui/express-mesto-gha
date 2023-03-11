const Card = require('../models/card');
const { BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка удалена' });
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккоректный идентификатор карточки' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка лайкнута' });
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккоректный идентификатор карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ message: 'Лайк снят с карточки' });
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккоректный идентификатор карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
