import { useCallback } from 'react';

import { applicationConfig } from '../../applicationConfig';
import { useAxios } from '../../utils/axios';

export const useChartData = ({
  start,
  end,
}: {
  start: number;
  end: number;
}) => {
  const [requestState, runRequest] = useAxios<any>(
    {
      url: `${applicationConfig.dexybankUrl}/gold/circulationSupply`,
      method: 'GET',
      params: {
        start,
        end,
      },
    },
    { useCache: false },
  );

  const refresh = useCallback(() => {
    runRequest();
  }, [runRequest]);

  return [
    requestState.data,
    requestState.loading,
    requestState.error,
    refresh,
  ] as const;
};
