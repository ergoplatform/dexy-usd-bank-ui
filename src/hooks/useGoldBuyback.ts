import { useCallback } from 'react';

import { applicationConfig } from '../applicationConfig';
import { useAxios } from '../utils/axios';

export const useGoldBuyback = () => {
  const [requestState, runRequest] = useAxios<any>(
    {
      url: `${applicationConfig.dexybankUrl}/gold/buyback?unconfirmed=1`,
      method: 'GET',
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
