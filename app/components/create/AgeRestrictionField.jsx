import React from 'react';
import PropTypes from 'prop-types';

import KeySelector from '../util/KeySelector';
import { AGES_ALL, AGES_18, AGES_21 } from '../../constants/ageRestrictions';

const AgeRestrictionField = ({ageRestriction, handleChange}) => {
  const displayNames = {
    [AGES_ALL]: 'all',
    [AGES_18]: '18+',
    [AGES_21]: '21+'
  };
  const FIELD_NAME = 'ageRestriction';

  const keySelectorProps = {
    keyList: [AGES_ALL, AGES_18, AGES_21],
    containerClass: 'checkbox-container',
    btnNameMap: displayNames,
    btnClass: 'checkbox age-btn',
    selection: ageRestriction,
    onChange: (key) => handleChange(FIELD_NAME, key)
  }

  return (
    <KeySelector {...keySelectorProps} />
  );
}

AgeRestrictionField.propTypes = {
  ageRestriction: PropTypes.string,
  handleChange: PropTypes.func
}

export default AgeRestrictionField;
