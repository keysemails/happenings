import { combineReducers } from 'redux';

import session from './session';
import errors from './errors';
import ui from './ui';
import entities from './entities';
import listeners from './listeners';
import callbacks from './callbacks';

const rootReducer = combineReducers({
  session,
  errors,
  ui,
  entities,
  listeners,
  callbacks
});

export default rootReducer;
