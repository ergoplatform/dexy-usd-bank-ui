import {
  Button,
  Flex,
  Modal,
  ModalRef,
  Tabs,
  useDevice,
} from '@ergolabs/ui-kit';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { Wallet } from '../../../../api/wallet/common/Wallet';
import {
  availableWallets,
  connectWallet,
  selectedWallet$,
} from '../../../../api/wallet/wallet';
import { useObservable } from '../../../hooks/useObservable';
import { Disclaimer } from './Disclaimer/Disclaimer';
import { ErgoPayTabPaneContent } from './ErgoPayTabPaneContent/ErgoPayTabPaneContent';

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--spectrum-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--spectrum-default-border-color) !important;
    }
  }
`;

const WalletView: React.FC<WalletItemProps> = ({ wallet, close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setWarning] = useState<ReactNode | undefined>(undefined);

  const handleClick = () => {
    setLoading(true);
    connectWallet(wallet).subscribe(
      (isConnected) => {
        setLoading(false);
        if (typeof isConnected === 'boolean' && isConnected) {
          close(true);
        } else if (isConnected) {
          setWarning(isConnected);
        }
      },
      () => {
        setLoading(false);
        window.open(wallet.extensionLink);
      },
    );
  };

  return (
    <>
      <WalletButton size="large" onClick={handleClick} loading={loading}>
        <Flex.Item flex={1} display="flex" align="center">
          {wallet.name}
        </Flex.Item>
        {wallet.icon}
      </WalletButton>
    </>
  );
};

type ChooseWalletModalProps = ModalRef<boolean>;

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
}): JSX.Element => {
  const [selectedWallet] = useObservable(selectedWallet$);

  const walletTab = (
    <Flex.Item marginTop={5} display="flex" col>
      {/* <Flex.Item marginBottom={4}>
        <Disclaimer />
      </Flex.Item> */}
      {availableWallets
        .filter((w) => !w.hidden)
        .map((wallet, index) => (
          <Flex.Item
            marginBottom={
              index === availableWallets.length - 1 && !selectedWallet ? 0 : 4
            }
            key={index}
          >
            <WalletView close={close} wallet={wallet} />
          </Flex.Item>
        ))}
    </Flex.Item>
  );

  const { s } = useDevice();
  return (
    <>
      <Modal.Title>Select a wallet</Modal.Title>
      <Modal.Content maxWidth={480} width="100%">
        {/* <Tabs fullWidth>
          <Tabs.TabPane tab="Browser wallet" key="browse_wallets">
            {walletTab}
          </Tabs.TabPane>
        </Tabs> */}
        {walletTab}
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
