const getPool = require('./connection').getConnectionPool;
const pool = getPool();

const hashPassword = require('./auth').hashPassword;
const { createUser, updateUser } = require('../queries/users');
const { createPost } = require('../queries/posts');


const resetEverything = async () => {
  const q = `
    do $$
      declare tbname text;
    begin
      for tbname in
        (select tablename from pg_tables where schemaname = 'happenings')
      loop
        execute 'truncate table happenings.' || tbname || ' restart identity cascade';
      end loop;
    end;
    $$;
  `
  const result = await pool.query(q);
  return result;
}


const createFakeUserData = async (username, email, password) => {
  console.log('creating user with username', username);
  try {
    const pw_hash = await hashPassword(password);
    const uid = await createUser(username, email, pw_hash);
    return uid;
  } catch (err) {
    throw err;
  }
}


const createFakePostData = (uid) => {
  console.log('creating post for uid', uid);
  const payload = {
    user_id: uid,
    username: 'TEST_USER',
    event_timestamp: 1000000000,
    title: 'TEST_POST',
    description: 'TEST_POST',
    full_url: 'https://fakesite.com/test_poster.png',
    full_storage_uri: 'https://fakesite.com/test_poster.png',
    thumb_url: 'https://fakesite.com/test_poster.png',
    thumb_storage_uri: 'https://fakesite.com/test_poster.png',
    location: 'TEST_PLACE',
    is_private: false,
    is_accessible: true,
    guests_can_invite: false,
    age_restriction: 'AGES_ALL'
  }
  return createPost(payload).then(postId => {
    return postId;
  });
}

const createFakeData = async () => {
  try {
    console.log('creating fake data...');
    const uid1 = await createFakeUserData('TEST_USER1', 'TEST_EMAIL1', 'TEST_PASSWORD');
    const uid2 = await createFakeUserData('TEST_USER2', 'TEST_EMAIL2', 'TEST_PASSWORD');
    const uid3 = await createFakeUserData('TEST_USER3', 'TEST_EMAIL3', 'TEST_PASSWORD');
    const uid4 = await createFakeUserData('DELETE_IN_TEST', 'TEST_EMAIL4', 'TEST_PASSWORD');

    const postId1 = await createFakePostData(uid1);
    const postId2 = await createFakePostData(uid2);
    const postId3 = await createFakePostData(uid3);
    const postId4 = await createFakePostData(uid4);

    return [
      uid1, uid2, uid3
    ]

  } catch (err) {
    throw err;
  }
}

const cleanUpFakeData = async () => {
  try {
    console.log('cleaning up fake data...');
    // cascade policy on user_id will clear out post entries too
    const result = await resetEverything();
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createFakeData,
  cleanUpFakeData
};
