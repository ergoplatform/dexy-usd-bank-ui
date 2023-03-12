import {
  combineLatest,
  filter,
  first,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
  switchMapTo,
} from 'rxjs';

import { Currency } from '../../common/models/Currency';
import { networkAsset } from '../../common/services/networkAsset';
import { addresses$ } from '../addresses/addresses';
import { networkContext$ } from '../networkContext/networkContext';
import { explorer } from '../wallet/common/explorer';
import { selectedWallet$ } from '../wallet/wallet';

export const networkAssetBalance$ = selectedWallet$.pipe(
  filter(Boolean),
  switchMapTo(networkContext$),
  switchMap(() => addresses$.pipe(first())),
  switchMap((addresses) =>
    combineLatest(
      addresses.map((address) => from(explorer.getBalanceByAddress(address))),
    ),
  ),
  map((balances) =>
    balances.reduce((acc, balance) => acc + (balance?.nErgs || 0n), 0n),
  ),
  map((sum) => new Currency(sum, networkAsset)),
  publishReplay(1),
  refCount(),
);
