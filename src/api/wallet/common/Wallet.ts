import { ErgoBox, ErgoTx, Prover } from '@ergolabs/ergo-sdk';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { Address, TxId } from '../../../common/types';

export interface Wallet extends Prover {
  readonly name: string;
  readonly icon: ReactNode;
  readonly previewIcon: ReactNode;
  readonly extensionLink: string;
  readonly onConnect?: () => void;
  readonly onDisconnect?: () => void;
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getChangeAddress: () => Observable<Address>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUtxos: () => Observable<ErgoBox[]>;
  readonly submitTx: (tx: ErgoTx) => Observable<TxId>;
  readonly hidden?: boolean;
}

export enum WalletState {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}
