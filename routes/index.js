const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { urlRegExp } = require('../utils/constants');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const { NotFoundError } = require('../utils/errors');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegExp),
  }),
}), createUser);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход успешный' });
});
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

module.exports = router;
