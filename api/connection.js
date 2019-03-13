const PG_CONFIG_DEV = require('./conf/happenings-dev.json');
const Pool = require('pg').Pool;

const pool = new Pool(PG_CONFIG_DEV);

const getConnInfo = (stage='dev') => {
  return PG_CONFIG_DEV;
}

/**
 * returns a connection pool
 * @param  {[string]} stage {'dev', 'prod'}
 * @return {Pool}       connection pool
 */
const getConnectionPool = (stage) => {
  const pgConf = getConnInfo(stage);
  return new Pool(pgConf)
}

module.exports = {
	getConnectionPool
}
