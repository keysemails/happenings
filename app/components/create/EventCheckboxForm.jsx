import React from 'react';
import CheckBoxField from './CheckBoxField';

const EventCheckboxForm = ({formData, handleChange}) => {
  const labelMap = {
    private: 'Private',
    guestsCanInvite: 'Guests can invite guests',
    accessible: 'This event is wheelchair accessible',
    ageRestriction: 'Age restriction'
  }
  const generateCheckboxes = () => {
    return Object.keys(labelMap).map(field => {
      return (
        <CheckBoxField
          key={field}
          field={field}
          isSelected={formData[field]}
          label={labelMap[field]}
          handleChange={handleChange}
        />
      )
    })
  }
  return (
    <div>
      { generateCheckboxes() }
    </div>
  )
}

export default EventCheckboxForm;
