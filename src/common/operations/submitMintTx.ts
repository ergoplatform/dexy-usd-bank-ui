import { ErgoTx, UnsignedErgoTx } from '@ergolabs/ergo-sdk';
import axios from 'axios';
import { filter, first, map, Observable, switchMap, tap, zip } from 'rxjs';

import { getAddresses } from '../../api/addresses/addresses';
import { selectedWallet$ } from '../../api/wallet/wallet';
import { applicationConfig } from '../../applicationConfig';

export const submitMintTx = (unsignedTx: UnsignedErgoTx): Observable<any> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) =>
      zip([getAddresses(), w.getChangeAddress()]).pipe(
        first(),
        switchMap(() => w.sign(unsignedTx)),
        switchMap((tx) => w.submitTx(tx)),
      ),
    ),
  );
