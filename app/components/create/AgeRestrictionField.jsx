import React from 'react';

import { KeySelector, getButtonBuilder } from '../util/KeySelector';
import { AGES_ALL, AGES_18, AGES_21 } from '../../constants/ageRestrictions';

const AgeRestrictionField = ({ageRestriction, handleChange}) => {
  const displayNames = {
    [AGES_ALL]: 'all',
    [AGES_18]: '18+',
    [AGES_21]: '21+'
  };
  const buttonBuilder = getButtonBuilder(displayNames, 'checkbox age-btn');
  const FIELD_NAME = 'ageRestriction';
  const keySelectorProps = {
    keyList: [AGES_ALL, AGES_18, AGES_21],
    containerClass: 'checkbox-container',
    buttonBuilder: buttonBuilder,
    selection: ageRestriction,
    onChange: (key) => handleChange(FIELD_NAME, key)
  }
  return (
    <KeySelector {...keySelectorProps} />
  );
}

export default AgeRestrictionField;
