import React from 'react';
import classNames from 'classnames';

import { AGES_ALL, AGES_18, AGES_21 } from '../../constants/ageRestrictions';

const AgeRestrictionField = ({ageRestriction, handleChange}) => {
  const field = 'ageRestriction';
  return (
    <div className='checkbox-container'>
      Age restriction
      <div
        className={
          classNames('checkbox age-btn', {'selected': ageRestriction === AGES_21})
        }
        onClick={() => handleChange(field, AGES_21)}>
        21+
      </div>
      <div
        className={
          classNames('checkbox age-btn', {'selected': ageRestriction === AGES_18})
        }
        onClick={() => handleChange(field, AGES_18)}>
        18+
      </div>
      <div
        className={
          classNames('checkbox age-btn', {'selected': ageRestriction === AGES_ALL})
        }
        onClick={() => handleChange(field, AGES_ALL)}>
        all
      </div>
    </div>
  )
}

export default AgeRestrictionField;