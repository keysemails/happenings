import React from 'react';
import classNames from 'classnames';

const CheckBoxField = ({ field, label, isSelected, handleChange }) => {
  const boxClass = classNames('checkbox', {'selected': isSelected});
  return (
    <div className='checkbox-container'>
      {label}
      <div
        className={boxClass}
        onClick={() => handleChange(field, !!!isSelected)}>
      </div>
    </div>
  )
}

export default CheckBoxField;

