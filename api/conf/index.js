const env = process.env.NODE_ENV || 'dev';
const conf = require(`./${env}`);

module.exports = conf;