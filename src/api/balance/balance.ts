import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { Balance } from '../../common/models/Balance';
import { networkAssetBalance$ } from '../networkAssetBalance/networkAssetBalance';
import { availableTokensData$ } from './availableTokensData';

export const balance$ = combineLatest([
  networkAssetBalance$,
  availableTokensData$,
]).pipe(
  debounceTime(100),
  map(([networkAssetBalance, availableTokensData]) =>
    availableTokensData.concat([
      [networkAssetBalance.amount, networkAssetBalance.asset],
    ]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);

export const useAssetsBalance = (): [Balance, boolean, Error] =>
  useObservable(balance$, [], new Balance([]));
