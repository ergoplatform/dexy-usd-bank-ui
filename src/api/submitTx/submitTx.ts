import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, switchMap } from 'rxjs';

import { selectedWallet$ } from '../wallet/wallet';

export const submitTx = (tx: ErgoTx) => {
  console.log(selectedWallet$);
  return selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => {
      console.log(w);
      return w.submitTx(tx);
    }),
  );
};
