import { ErgoTx, UnsignedErgoTx } from '@ergolabs/ergo-sdk';
import axios from 'axios';
import { filter, first, map, Observable, switchMap, tap, zip } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { addresses$ } from '../addresses/addresses';
import { VestingItem } from '../vesting/vesting';
import { selectedWallet$ } from '../wallet/wallet';

export const submitRedeemTx = (vestingItem: VestingItem): Observable<any> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) =>
      zip([addresses$.pipe(first()), w.getChangeAddress()]).pipe(
        first(),
        switchMap(([addresses, address]) =>
          axios.post<UnsignedErgoTx>(
            `${applicationConfig.ergopadUrl}/vesting/redeemWithNFT`,
            {
              boxId: vestingItem.boxId,
              address,
              utxos: [],
              txFormat: 'eip-12',
              addresses: addresses,
            },
          ),
        ),
        map((res) => res.data),
        switchMap((unsignedTx) => w.sign(unsignedTx)),
        switchMap((tx) => w.submitTx(tx)),
      ),
    ),
  );
