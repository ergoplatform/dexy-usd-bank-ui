import axios from 'axios';
import { from, map, Observable, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';

export interface activeRoundResponse {
  activeRounds: {
    'Whitelist tokenId': string;
    remaining: number;
    proxyNFT: string;
    roundName: string;
  }[];
  soldOutRounds: any;
}

const remainingTokens$ = from(
  axios.get(`${applicationConfig.ergopadUrl}/vesting/activeRounds`),
).pipe(
  map((res) => res.data),
  publishReplay(1),
  refCount(),
);

export const getRemainingTokensByNftId = (
  nftIds: string[],
  totalAllocation: number,
): Observable<number> =>
  remainingTokens$.pipe(
    map((data: activeRoundResponse) => {
      const rounds = data.activeRounds.filter((round) =>
        nftIds.includes(round.proxyNFT),
      );
      if (!rounds.length) {
        return totalAllocation;
      }

      return rounds.reduce((sum, item) => sum + item.remaining, 0);
    }),
  );
