import React from 'react';
import CheckBoxField from './CheckBoxField';
import AgeRestrictionField from './AgeRestrictionField';

const EventCheckboxForm = ({formData, handleChange}) => {
  const labelMap = {
    isPrivate: 'Private',
    isAccessible: 'This event is wheelchair accessible',
    guestsCanInvite: 'Guests can invite guests',
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
      <AgeRestrictionField
        ageRestriction={formData.ageRestriction}
        handleChange={handleChange}
      />
    </div>
  )
}

export default EventCheckboxForm;
