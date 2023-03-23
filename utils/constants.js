const NODE_ENV = require('crypto').randomBytes(32).toString('hex');

const urlRegExp = /https?:\/\/(www\.)?[\w-._~:/?#[\]@!$&'()*+,;=]+#?$/i;

module.exports = {
  NODE_ENV,
  urlRegExp,
};
