import firebase from 'firebase';
import base from '../utils/rebase';
import * as types from '../constants/actionTypes.js'

let db = base.initializedApp.database();

export function listenRequested(metaType, ref, postId) {
  return {
    type: types.FIREBASE_LISTEN_REQUESTED,
    metaType,
    ref,
    postId
  }
}
export function listenRejected(metaType, error, postId) {
  return {
    type: types.FIREBASE_LISTEN_REJECTED,
    metaType,
    error,
    postId
  }
}
export function listenFulfilled(metaType, items, postId) {
  return {
    type: types.FIREBASE_LISTEN_FULFILLED,
    metaType,
    items,
    postId
  }
}
export function listenChildAdded(metaType, id, value, postId) {
  return {
    type: types.FIREBASE_LISTEN_CHILD_ADDED,
    metaType,
    id,
    value,
    postId
  }
}
export function listenChildChanged(metaType, id, value, postId) {
  return {
    type: types.FIREBASE_LISTEN_CHILD_CHANGED,
    metaType,
    id,
    value,
    postId
  }
}
export function listenChildRemoved(metaType, id, postId) {
  return {
    type: types.FIREBASE_LISTEN_CHILD_REMOVED,
    metaType,
    id,
    postId
  }
}

export function listenRemoved(metaType, postId) {
  return {
    type: types.FIREBASE_LISTEN_REMOVED,
    metaType,
    postId
  }
}

export function removeListenerRef(state, metaType, postId) {
  if (state && state.listeners &&  state.listeners[metaType] &&
    state.listeners[metaType].ref) {
    state.listeners[metaType].ref.off();
  } else if (postId && state && state.listeners &&
    state.listeners[metaType] && state.listeners[metaType][postId] &&
    state.listeners[metaType][postId].ref) {
      state.listeners[metaType][postId].ref.off();
  }
  return Promise.resolve();
}

export function removeListener(metaType, postId) {
  return (dispatch, getState) => {
    return removeListenerRef(getState(), metaType, postId).then(() => {
      dispatch(listenRemoved(metaType, postId))
    })
  }
}

export function listenToPath(path, metaType, postId) {
  return (dispatch, getState) => {
    const ref = db.ref(path)
    dispatch(listenRequested(metaType, ref, postId))


    const stateSlice = () => (
      postId ? getState().listeners[metaType][postId] : getState().listeners[metaType]
    );

    ref.on('child_added', (snap) => {
      if (stateSlice().inProgress) {
        return
      }
      const val = snap.val()
      dispatch(listenChildAdded(metaType, snap.key, val, postId))
    })
    ref.on('child_changed', (snap) => {
      if (stateSlice().inProgress) {
        return
      }
      const val = snap.val()
      dispatch(listenChildChanged(metaType, snap.key, val, postId))
    })
    ref.on('child_removed', (snap) => {
      if (stateSlice().inProgress) {
        return
      }
      dispatch(listenChildRemoved(metaType, snap.key, postId))
    })
    return ref.once('value').then(snap => {
      //better to have an empty object then a null
      //value if data does not exist
      const val = snap.val()
      const value = val ? val : { }
      dispatch(listenFulfilled(metaType, value, postId))
    })
    .catch(error => {
      dispatch(listenRejected(metaType, error, postId))
    })
  }
}
