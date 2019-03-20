const envConfig = require('../conf');
const Pool = require('pg').Pool;

/**
 * returns a connection pool
 * @param  {[string]} stage {'dev', 'prod'}
 * @return {Pool}       connection pool
 */
const getConnectionPool = () => {
  const pgConf = envConfig.db;
  return new Pool(pgConf)
}

module.exports = {
	getConnectionPool
}
