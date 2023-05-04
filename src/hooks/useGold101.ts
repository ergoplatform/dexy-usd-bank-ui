import { useCallback } from 'react';

import { applicationConfig } from '../applicationConfig';
import { useAxios } from '../utils/axios';

export const useGold101 = () => {
  const [requestState, runRequest] = useAxios<any>(
    {
      url: `${applicationConfig.dexybankUrl}/gold/tracking101Box`,
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
