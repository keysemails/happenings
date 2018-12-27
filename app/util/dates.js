import moment from 'moment';

// the ISO 8601 supported string format we use.
export const DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm';

export function parseDate(year, month, day, hour, minute) {
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
