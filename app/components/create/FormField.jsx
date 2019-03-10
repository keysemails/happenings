import React from 'react';

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