import moment from 'moment';
import { TIMELINE_GRANULARITIES } from '../constants';

// the ISO 8601 supported string format we use.
export const DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm';


export function parseDate({year, month, day, hour, minute}) {
  let dateStr = `${year}-${month}-${day} ${hour}:${minute}`;
  return moment(dateStr, DATE_FORMAT_STRING);
}


export function isFutureEvent(eventMomentObj) {
  const thisVeryMoment = moment();
  return eventMomentObj > thisVeryMoment;
}


export function separate(datestr) {
  let [date, time] = datestr.split(' ');
  let [year, month, day] = date.split('-');
  let [hour, minute] = time.split(':');
  return ({ year, month, day, hour, minute });
}


/**
 * Group a collection of posts by a calendar granularity
 * @param  {[type]} posts       object where keys are postIds of authors posts
 * @param  {string} granularity {'DAY', 'MONTH', 'YEAR'}
 * @return {object}             keys are dates at a granularity and values are arrays containgin post objects.
 */
export function groupByGranularity(posts, granularity) {
  const grouped = {};
  const groupByFormat = TIMELINE_GRANULARITIES[granularity];

  Object.keys(posts).forEach(postId => {
    let postData = posts[postId];
    let m = moment(postData.event_timestamp);
    let groupBy = m.format(groupByFormat);

    if (grouped.hasOwnProperty(groupBy)) {
      grouped[groupBy].push(postData);
    } else {
      grouped[groupBy] = [postData];
    }
  });
  return grouped;
}
