const Card = require('../models/card');
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).populate('owner')
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else if (req.user._id !== card.owner.id) {
        next(new ForbiddenError('Нельзя удалить чужую карточку'));
      } else {
        Card.findByIdAndRemove(cardId).then(() => res.send({ message: 'Карточка удалена' }));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка лайкнута' });
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ message: 'Лайк снят с карточки' });
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch(next);
};
