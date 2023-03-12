import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import {
  filter,
  from,
  map,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { localStorageManager } from '../../../common/services/localStorageManager';
import { explorer } from '../common/explorer';
import { Wallet } from '../common/Wallet';
import { ReactComponent as ErgoLogo } from './ergo-logo-icon.svg';
export const ERGOPAY_ADDRESS_KEY = 'ergopay-wallet';

export const setErgopayAddress = (address: string): void =>
  localStorageManager.set<string>(ERGOPAY_ADDRESS_KEY, address);

const ergopayAddress$ = localStorageManager
  .getStream<string>(ERGOPAY_ADDRESS_KEY)
  .pipe(filter(Boolean), publishReplay(1), refCount());

export const ErgopayWallet: Wallet = {
  name: 'ErgoPay',
  icon: <ErgoLogo />,
  hidden: true,
  previewIcon: <ErgoLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    ergopayAddress$.pipe(
      switchMap((address) =>
        from(explorer.searchUnspentBoxesByAddress(address)),
      ),
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () => ergopayAddress$.pipe(map((address) => [address])),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () => ergopayAddress$,
  getAddresses: () => ergopayAddress$.pipe(map((address) => [address])),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
};
