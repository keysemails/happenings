import { combineReducers } from 'redux';

import users from './users';
import posts from './posts';
import notifications from './inbox';

const entitiesReducer = combineReducers({
  users,
  posts,
  notifications
});

export default entitiesReducer;
