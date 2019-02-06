import React from 'react';
import PropTypes from 'prop-types';

import {
  GRANULARITY_OPTIONS, GRANULARITY_DISPLAY_NAMES } from '../../constants';

import KeySelector from '../util/KeySelector';

const GranularitySelector = ({selection, onChange}) => {
  const props = {
    keyList: GRANULARITY_OPTIONS,
    containerClass: 'granularity-selector',
    btnNameMap: GRANULARITY_DISPLAY_NAMES,
    btnClass: 'granularity-btn',
    selection,
    onChange
  }
  return (
    <KeySelector {...props} />
  )
};

GranularitySelector.propTypes = {
  selection: PropTypes.string,
  onChange: PropTypes.func
}

export default GranularitySelector;
