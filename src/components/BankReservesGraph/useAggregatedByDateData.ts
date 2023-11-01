import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { PoolChartData } from '../../common/models/CirculationSupplyData';

export const useAggregatedByDateData = (
  rawData: PoolChartData[],
  ticks: DateTime[],
): PoolChartData[] => {
  return useMemo(() => {
    if (rawData.length < 1) {
      return [];
    }

    let j = -1;
    const res = ticks
      .filter((lts) => lts.valueOf() > rawData[0].ts)
      .map((lts: DateTime) => {
        while (rawData[j + 1]?.ts < lts.valueOf()) {
          j++;
        }
        return rawData[j === -1 ? 0 : j].clone({ date: lts.valueOf() });
      });
    res.push(rawData[rawData.length - 1].clone({ date: Date.now() }));
    return res;
  }, [rawData]);
};
