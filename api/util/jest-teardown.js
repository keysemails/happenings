const cleanUpFakeData = require('./test-helpers').cleanUpFakeData;

module.exports = async () => {
  await cleanUpFakeData(global.__TEST_UIDS__);
}

