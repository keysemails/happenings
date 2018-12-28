import * as types from '../constants/actionTypes.js';
import { separate } from '../util/dates';

export const fillFormData = (post) => {
  const { title, description, location, date_string } = post;
  const { year, month, day, hour, minute } = separate(date_string);
  return {
    type: types.POPULATE_EVENT_INFO,
    formData: {
      title,
      description,
      location,
      year,
      month,
      day,
      hour,
      minute
    }
  }
};

export const updateFormField = (fieldName, value) => ({
  type: types.UPDATE_FORM_FIELD,
  fieldName,
  value
});