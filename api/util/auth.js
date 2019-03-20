const bcrypt = require('bcrypt');
const { secret } = require('../conf/secret.json');


const hashPassword = (plainText) => {
  const HASH_COST = 10;
  return bcrypt.hash(plainText, HASH_COST);
}

module.exports = {
  hashPassword
}
