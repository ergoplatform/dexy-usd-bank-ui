import { ReactNode } from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { Wallet, WalletState } from './common/Wallet';
import { makeWalletManager } from './common/WalletManager';
import { ErgopayWallet } from './ergopay/ergopay';
import { Nautilus } from './nautilus/nautilus';

const ERGO_SELECTED_WALLET_TOKEN = 'ergo-selected-wallet';

export const ergoWalletManager = makeWalletManager<Wallet>(
  ERGO_SELECTED_WALLET_TOKEN,
  [Nautilus, ErgopayWallet],
  (w: Wallet) => w.connectWallet(),
);

export const availableWallets: Wallet[] = ergoWalletManager.availableWallets;

export const selectedWallet$: Observable<Wallet | undefined> =
  ergoWalletManager.selectedWallet$;

export const walletState$: Observable<WalletState> =
  ergoWalletManager.selectedWalletState$;

export const disconnectWallet = (): void =>
  ergoWalletManager.removeSelectedWallet();

export const connectWallet = (w: Wallet): Observable<boolean | ReactNode> =>
  ergoWalletManager.setSelectedWallet(w);

export const isWalletSetuped$ = walletState$.pipe(
  map(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  publishReplay(1),
  refCount(),
);
