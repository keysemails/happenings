import * as types from '../constants/actionTypes.js';
import * as AgeRestrictions from '../constants/ageRestrictions.js';

const INITIAL_FORM_STATE = {
    title: '',
    location: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    description: '',
    private: false,
    accessible: false,
    guestsCanInvite: false,
    ageRestriction: AgeRestrictions.AGES_ALL
};

const formReducer = (state=INITIAL_FORM_STATE, action) => {
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

export default formReducer;