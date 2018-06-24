import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleWares = composeEnhancers(applyMiddleware(thunk, logger))

const configureStore = (preloadedState = {}) => {
  return createStore(
    rootReducer,
    preloadedState,
    middleWares
  )
};

export default configureStore;
