import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, switchMap } from 'rxjs';

import { selectedWallet$ } from '../wallet/wallet';

export const submitTx = (tx: ErgoTx) => {
  return selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => {
      return w.submitTx(tx);
    }),
  );
};
