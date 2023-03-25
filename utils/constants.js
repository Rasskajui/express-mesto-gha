const NODE_ENV = require('crypto').randomBytes(32).toString('hex');

const urlRegExp = /^(https?:\/\/)(www\.)?([\w-._~:/?#[\]@!$&'()*+,;=]+\.)+[\w-._~:/?#[\]@!$&'()*+,;=]+#?$/;

module.exports = {
  NODE_ENV,
  urlRegExp,
};
