// TODO normalize state? currently storing children nestedd under
// listeners slice of state as 'items'
import * as types from '../constants/actionTypes.js';

export const metaTypes = {
  people: 'people',
  followers: 'followers',
  attendees: 'attendees',
  likers: 'likers'
}

function getInitialState() {
  let initialState = { }
  Object.keys(metaTypes).forEach((metaType) => {
    if (metaType === 'people' || metaType === 'followers') {
      initialState[metaType] = { inProgress: false, items: { } }
    } else {
      initialState[metaType] = {}
    }
  })

  return initialState
}

const shapeState = (state, action, inProgress, error, ref, items) => {
  if (action.postId) {
    return {
      ...state,
      [action.metaType]: {
        ...state[action.metaType],
        [action.postId]: { inProgress, error, ref, items }
      }
    };
  } else {
    return {
      ...state,
      [action.metaType]: {
        ...state[action.metaType],
        inProgress, error, ref, items
      }
    };
  }
}

const getProperty = (action, state, propName) => {
  if (action.postId) {
    if (state[action.metaType][action.postId]) {
      return state[action.metaType][action.postId][propName];
    } else {
      if (propName === 'ref') {
        return null
      } else if (propName === 'error') {
        return '';
      } else if (propName === 'items') {
        return {};
      } else {
        return false;
      }
    }
  } else {
    return state[action.metaType][propName];
  }
}

const initialState = getInitialState()

const listenersReducer = (state = initialState, action) => {
  let inProgress, error, ref, items;
  switch(action.type) {
    case types.FIREBASE_LISTEN_REQUESTED:
      items = getProperty(action, state, 'items');
      return shapeState(state, action, true, '', action.ref, items)
    case types.FIREBASE_LISTEN_FULFILLED:
      ref = getProperty(action, state, 'ref');
      return shapeState(state, action, false, '', ref, action.items)
    case types.FIREBASE_LISTEN_REJECTED:
      ref = getProperty(action, state, 'ref');
      items = getProperty(action, state, 'items');
      return shapeState(state, action, false, action.error, ref, items)
    case types.FIREBASE_LISTEN_REMOVED:
      return shapeState(state, action, false, '', null, {})
    case types.FIREBASE_LISTEN_CHILD_ADDED:
    case types.FIREBASE_LISTEN_CHILD_CHANGED:
      ref = getProperty(action, state, 'ref');
      let currentItems = getProperty(action, state, 'items');
      items = { ...currentItems, [action.id]: action.value };
      return shapeState(state, action, false, '', ref, items);
    case types.FIREBASE_LISTEN_CHILD_REMOVED:
      currentItems = getProperty(action, state, 'items');
      items = { ...currentItems };
      delete items[action.id]
      ref = getProperty(action, state, 'ref');
      return shapeState(state, action, false, '', ref, items)
    default:
      return state;
  }
};

export default listenersReducer;
