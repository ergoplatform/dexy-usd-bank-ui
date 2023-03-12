import {
  ConnectWalletButton as BaseConnectWalletButton,
  ConnectWalletButtonProps,
  Modal,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { isWalletSetuped$ } from '../../../api/wallet/wallet';
import { useObservable } from '../../hooks/useObservable';
import { ChooseWalletModal } from './ChooseWalletModal/ChooseWalletModal';

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  children,
  ...rest
}) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);

  const openSelectWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <BaseConnectWalletButton
      isWalletConnected={isWalletConnected}
      onClick={openSelectWalletModal}
      {...rest}
    >
      {children}
    </BaseConnectWalletButton>
  );
};
