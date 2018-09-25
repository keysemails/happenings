import { combineReducers } from 'redux';

import loading from './loading';
import search from './search';

const uiReducer = combineReducers({
  loading,
  search
});

export default uiReducer;
