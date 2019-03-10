import * as types from '../constants/actionTypes.js';
import * as DateUtil from '../utils/dates';

/**
 * @param  {[string]}
 * @return {[null]}
 *
 * dispatched by getPostData to fill form fields for edit event page
 */
export const fillFormData = (postID) => (dispatch, getState) => {
  const store = getState();
  const { title, description, location, date_string,
    isPrivate, isAccessible, guestsCanInvite, ageRestriction
  } = store.entities.posts[postID];
  const { year, month, day, hour, minute } = DateUtil.separate(date_string);
  dispatch(populateFormFields({
    title,
    description,
    location,
    year,
    month,
    day,
    hour,
    minute,
    isPrivate,
    isAccessible,
    guestsCanInvite,
    ageRestriction
  }));
};

export const validateFormFields = () => (dispatch, getState) => {
  const store = getState();
  const formFields = store.ui.form.fields;
  const momentObj = DateUtil.parseDate(formFields);
  const isValid = momentObj.isValid();
  const isFutureEvent = DateUtil.isFutureEvent(momentObj);
}

export const populateFormFields = (formData) => ({
  type: types.POPULATE_EVENT_INFO,
  formData
});

export const updateFormField = (fieldName, value) => ({
  type: types.UPDATE_FORM_FIELD,
  fieldName,
  value
});

export const loadLocalImage = (imageFille) => ({
  type: types.LOAD_LOCAL_IMAGE,
  eventImage: imageFille
});

export const clearLocalImage = () => ({
  type: types.CLEAR_LOCAL_IMAGE
});

export const clearEventImage = () => ({
  type: types.CLEAR_EVENT_IMAGE
});

export const clearFormFields = () => ({
  type: types.CLEAR_FORM_FIELDS
});
