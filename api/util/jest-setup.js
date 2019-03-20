const createFakeData = require('./test-helpers').createFakeData;

module.exports = async () => {
  const uids = await createFakeData();
  global.__TEST_UIDS__ = uids;
}
