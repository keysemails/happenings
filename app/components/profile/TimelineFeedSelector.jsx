import React from 'react';
import PropTypes from 'prop-types';
import {
  TIMELINE_OPTIONS, TIMELINE_DISPLAY_NAMES } from '../../constants';

import KeySelector from '../util/KeySelector';

const TimelineFeedSelector = ({selection, onChange}) => {
  const props = {
    keyList: TIMELINE_OPTIONS,
    containerClass: 'timeline-selector',
    btnNameMap: TIMELINE_DISPLAY_NAMES,
    btnClass: 'timeline-btn',
    selection,
    onChange
  }
  return (
    <KeySelector {...props} />
  )
};

TimelineFeedSelector.propTypes = {
  selection: PropTypes.string,
  onChange: PropTypes.func
}

export default TimelineFeedSelector;
