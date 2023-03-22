const jwt = require('jsonwebtoken');
const { UNAUTHORISED_ERROR_CODE, NODE_ENV } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(UNAUTHORISED_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV);
  } catch (err) {
    return res
      .status(UNAUTHORISED_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
