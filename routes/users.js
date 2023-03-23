const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { urlRegExp } = require('../utils/constants');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegExp),
  }),
}), updateAvatar);

module.exports = router;
