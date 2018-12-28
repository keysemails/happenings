import * as types from '../constants/actionTypes.js';
import * as AgeRestrictions from '../constants/ageRestrictions.js';

const INITIAL_FIELD_STATES = {
    title: '',
    location: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    description: '',
    isPrivate: false,
    isAccessible: false,
    guestsCanInvite: false,
    ageRestriction: AgeRestrictions.AGES_ALL
};
const INITIAL_FORM_STATE = {
    fields: INITIAL_FIELD_STATES,
    localImage: null,
    eventImageCleared: false
};

const fieldsReducer = (state=INITIAL_FIELD_STATES, action) => {
  switch(action.type) {
    case types.UPDATE_FORM_FIELD:
      return {
        ...state, [action.fieldName]: action.value
      };
    case types.UPDATE_CHECKBOX_VAL:
      return {
        ...state, [action.fieldName]: action.value
      }
    case types.POPULATE_EVENT_INFO:
      return { ...state, ...action.formData }
    default:
      return state;
  }
};

const formReducer = (state=INITIAL_FORM_STATE, action) => {
  switch(action.type) {
    case types.UPDATE_FORM_FIELD:
      return {
        ...state, fields: fieldsReducer(state.fields, action)
      };
    case types.UPDATE_CHECKBOX_VAL:
      return {
        ...state, fields: fieldsReducer(state.fields, action)
      }
    case types.POPULATE_EVENT_INFO:
      return {
        ...state, fields: fieldsReducer(state.fields, action)
      }
    case types.CLEAR_FORM_FIELDS:
      return {
        ...state, ...INITIAL_FORM_STATE
      }
    case types.LOAD_LOCAL_IMAGE:
      return {...state, localImage: action.eventImage}
    case types.CLEAR_LOCAL_IMAGE:
      return {...state, localImage: null }
    case types.CLEAR_EVENT_IMAGE:
      return { ...state, eventImageCleared: true }
    default:
      return state;
  }
}

export default formReducer;