export const PAGE_SIZES = {
  DISCOVER_FEED: 6,
  COMMENTS: 3
};

const MONTH = 'MONTH';
const DAY = 'DAY';
const YEAR = 'YEAR';

export const TIMELINE_GRANULARITIES = {
  DAY,
  MONTH,
  YEAR
}

export const TIMELINE_GROUPBY_KEYS = {
  [DAY]: 'YYYY-MM-DD',
  [MONTH]: 'YYYY-MM',
  [YEAR]: 'YYYY'
};

const ATTENDING = 'ATTENDING';
const STARRED = 'STARRED';
const HOST = 'HOST';

export const TIMELINE_FEED_TYPES = {
  ATTENDING,
  STARRED,
  HOST
};

export const GRANULARITY_DISPLAY_NAMES = {
  [DAY]: 'Week',  // lol
  [MONTH]: 'Month',
  [YEAR]: 'Year'
};

export const TIMELINE_DISPLAY_NAMES = {
  [ATTENDING]: 'Attend',
  [STARRED]: 'Star',
  [HOST]: 'Host'
};

export const GRANULARITY_OPTIONS = [
  DAY, MONTH, YEAR
];

export const TIMELINE_OPTIONS = [
  ATTENDING, STARRED, HOST
];
