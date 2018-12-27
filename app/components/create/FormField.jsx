import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({name, value, placeholder, handleChange}) => {
  return (
    <div>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  )
}

export default FormField;