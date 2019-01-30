import React from 'react';
import {
  GRANULARITY_OPTIONS, GRANULARITY_DISPLAY_NAMES } from '../../constants';

import {KeySelector, getButtonBuilder} from '../util/KeySelector';

const GranularitySelector = ({selection, onChange}) => {
  const buttonBuilder = getButtonBuilder(GRANULARITY_DISPLAY_NAMES, 'granularity-btn');
  const props = {
    keyList: GRANULARITY_OPTIONS,
    containerClass: 'granularity-selector',
    buttonBuilder,
    selection,
    onChange
  }
  return (
    <KeySelector {...props} />
  )
};

export default GranularitySelector;
