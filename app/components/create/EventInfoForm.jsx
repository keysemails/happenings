import React from 'react';
import * as DateUtil from '../../utils/dates';

import DateInput from './DateInput';
import FormField from './FormField';
import EventCheckboxForm from './EventCheckboxForm';

const EventInfoForm = ({ formData, updateFormField }) => {
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;
    updateFormField(fieldName, value);
  }
  return (
    <div>
      <form>
        <FormField
          name="title"
          value={formData.title}
          placeholder="Title"
          handleChange={handleChange}
        />
        <FormField
          name="location"
          value={formData.location}
          placeholder="Location"
          handleChange={handleChange}
        />
        <section>
          <DateInput
            year={formData.year}
            month={formData.month}
            day={formData.day}
            hour={formData.hour}
            handleChange={handleChange}
          />
        </section>
        <FormField
          name="description"
          value={formData.description}
          placeholder="Description"
          handleChange={handleChange}
        />
        <EventCheckboxForm
          formData={formData}
          handleChange={updateFormField}
        />
      </form>
    </div>
  )
}

export default EventInfoForm;
