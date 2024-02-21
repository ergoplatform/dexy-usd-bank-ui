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
import { getAddresses } from '../addresses/addresses';
import { networkContext$ } from '../networkContext/networkContext';
import { explorer } from '../wallet/common/explorer';

export const networkAssetBalance$ = networkContext$.pipe(
  switchMap(() => getAddresses()),
  switchMap((addresses) => {
    return combineLatest(
      addresses.map((address) => from(explorer.getBalanceByAddress(address))),
    );
  }),
  map((balances) =>
    balances.reduce((acc, balance) => acc + (balance?.nErgs || 0n), 0n),
  ),
  map((sum) => new Currency(sum, networkAsset)),
  publishReplay(1),
  refCount(),
);
