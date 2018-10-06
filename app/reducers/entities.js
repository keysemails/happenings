import { combineReducers } from 'redux';

import users from './users';
import posts from './posts';
import inbox from './inbox';

const entitiesReducer = combineReducers({
  users,
  posts,
  inbox
});

export default entitiesReducer;
