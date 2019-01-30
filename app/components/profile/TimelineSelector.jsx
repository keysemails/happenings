import React from 'react';
import {
  TIMELINE_OPTIONS, TIMELINE_DISPLAY_NAMES } from '../../constants';

import { KeySelector, getButtonBuilder } from '../util/KeySelector';

const TimelineSelector = ({selection, onChange}) => {
  const buttonBuilder = getButtonBuilder(TIMELINE_DISPLAY_NAMES, 'timeline-btn');
  const props = {
    keyList: TIMELINE_OPTIONS,
    containerClass: 'timeline-selector',
    buttonBuilder,
    selection,
    onChange
  }
  return (
    <KeySelector {...props} />
  )
};

export default TimelineSelector;
