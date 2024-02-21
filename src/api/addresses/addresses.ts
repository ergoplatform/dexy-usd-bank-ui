import { Address } from '@ergolabs/ergo-sdk';
import {
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  switchMapTo,
} from 'rxjs';

import { appTick$ } from '../../common/streams/appTick';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const getAddresses = (): Observable<Address[]> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getAddresses() : of([]),
    ),
    publishReplay(1),
    refCount(),
  );
