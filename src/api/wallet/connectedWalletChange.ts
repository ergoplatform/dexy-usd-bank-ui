import {
  filter,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Wallet, WalletState } from './common/Wallet';
import { selectedWallet$, walletState$ } from './wallet';

// TODO: RENAME
export const connectedWalletChange$: Observable<Wallet | undefined> =
  selectedWallet$.pipe(
    switchMap((selectedWallet) => {
      if (!selectedWallet) {
        return of(undefined);
      }

      return walletState$.pipe(
        filter((state) => state === WalletState.CONNECTED),
        mapTo(selectedWallet),
      );
    }),
    publishReplay(1),
    refCount(),
  );
