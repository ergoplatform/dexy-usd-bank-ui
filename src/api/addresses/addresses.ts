import { of, publishReplay, refCount, switchMap, switchMapTo } from 'rxjs';

import { appTick$ } from '../../common/streams/appTick';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const addresses$ = appTick$.pipe(
  switchMapTo(connectedWalletChange$),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getAddresses() : of([]),
  ),
  publishReplay(1),
  refCount(),
);
