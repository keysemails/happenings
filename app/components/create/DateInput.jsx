import React from 'react';
import PropTypes from 'prop-types';

const DateInput = ({year, month, day, hour, handleChange}) => {
  return (
    <div>
      <input
        type="text"
        name="year"
        value={year}
        placeholder="YYYY"
        className='form-input short'
        onChange={handleChange}
      />
      <input
        type="text"
        name="month"
        value={month}
        placeholder="MM"
        className='form-input short'
        onChange={handleChange}
      />
      <input
        type="text"
        name="day"
        value={day}
        placeholder="DD"
        className='form-input short'
        onChange={handleChange}
      />
      <input
        type="text"
        name="hour"
        value={hour}
        placeholder="HH"
        className='form-input short'
        onChange={handleChange}
      />
    </div>
  )
}

export default DateInput;