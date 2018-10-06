import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes.js';
import loading from './loading';
import search from './search';
import modals from './modals';

const uiReducer = combineReducers({
  loading,
  search,
  modals
});

export default uiReducer;
