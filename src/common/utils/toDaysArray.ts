import { DateTime, Interval } from 'luxon';

export const toDaysArray = (interval: Interval): DateTime[] => {
  const days: DateTime[] = [];
  let tmpDateTime: DateTime = interval.start;

  while (interval.contains(tmpDateTime)) {
    days.push(tmpDateTime);
    tmpDateTime = tmpDateTime.plus({ day: 1 });
  }
  return days;
};
