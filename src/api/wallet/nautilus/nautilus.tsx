import React from 'react';

import { Wallet } from '../common/Wallet';
import { connectWallet } from './connectWallet';
import {
  getAddresses,
  getChangeAddress,
  getUnusedAddresses,
  getUsedAddresses,
} from './getAddresses';
import { getUtxos } from './getUtxos';
import { ReactComponent as NautilusLogo } from './nautilus-logo-icon.svg';
import { sign } from './sign';
import { signInput } from './signInput';
import { submitTx } from './submitTx';

export const Nautilus: Wallet = {
  name: 'Nautilus Wallet',
  icon: <NautilusLogo />,
  previewIcon: <NautilusLogo width={21} height={21} />,
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
  getUtxos,
  getUsedAddresses,
  getUnusedAddresses,
  getChangeAddress,
  getAddresses,
  sign,
  signInput,
  submitTx,
};
