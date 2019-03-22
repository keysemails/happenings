const { createFakeData, cleanUpFakeData } = require('./test-helpers');

module.exports = async () => {
  const _ = await cleanUpFakeData();
  const uids = await createFakeData();
  global.__TEST_UIDS__ = uids;
}
