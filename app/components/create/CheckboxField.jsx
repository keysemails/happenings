import React from 'react';

const CheckBoxField = ({label, isSelected, handleChange}) => {
  return (
    <div className='checkbox-container'>
      {label} <div className='checkbox'></div>
    </div>
  )
}

export default CheckBoxField;
