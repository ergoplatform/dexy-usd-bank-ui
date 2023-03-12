import {
  Button,
  Dropdown,
  Flex,
  LoadingOutlined,
  Menu,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { networkAssetBalance$ } from '../../../api/networkAssetBalance/networkAssetBalance';
import { disconnectWallet } from '../../../api/wallet/wallet';
import { ActiveMark } from '../../../common/components/ActiveMark/ActiveMark';
import { ConnectWalletButton } from '../../../common/components/ConnectWalletButton/ConnectWalletButton';
import { useObservable } from '../../../common/hooks/useObservable';

const StyledMenu = styled(Menu)`
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover,
  .ant-dropdown-menu-item.ant-dropdown-menu-item-active,
  .ant-dropdown-menu-item.ant-dropdown-menu-submenu-title-active,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-item-active,
  .ant-dropdown-menu-submenu-title.ant-dropdown-menu-submenu-title-active {
    background-color: transparent;
  }

  .ant-dropdown-menu-item:hover {
    background-color: rgba(67, 67, 67, 0.4) !important;
  }
`;

export const RightPanel: FC = () => {
  const [balance, balanceLoading] = useObservable(networkAssetBalance$);

  const overlay = (
    <StyledMenu style={{ padding: '4px', width: '200px' }}>
      <Menu.Item key="disconnect" onClick={disconnectWallet}>
        Disconnect Wallet
      </Menu.Item>
    </StyledMenu>
  );

  return (
    <ConnectWalletButton caption="Connect wallet" size="large">
      <Dropdown overlay={overlay} placement="bottomRight" trigger={['click']}>
        <Button size="large" type="default">
          <Flex align="center">
            <Flex.Item marginRight={2}>
              <ActiveMark active />
            </Flex.Item>
            {!balanceLoading ? (
              <>
                <Flex.Item marginRight={2}>
                  {balance?.toCurrencyString()}
                </Flex.Item>
              </>
            ) : (
              <LoadingOutlined />
            )}
          </Flex>
        </Button>
      </Dropdown>
    </ConnectWalletButton>
  );
};
