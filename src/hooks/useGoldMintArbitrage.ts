import { Amount, Box } from '@fleet-sdk/common';
import { useCallback } from 'react';

import { applicationConfig } from '../applicationConfig';
import { useAxios } from '../utils/axios';

export const useGoldMintArbitrage = () => {
  const [requestState, runRequest] = useAxios<Box<Amount>>(
    {
      url: `${applicationConfig.dexybankUrl}/gold/mint/arbitrage?ui=1`,
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
