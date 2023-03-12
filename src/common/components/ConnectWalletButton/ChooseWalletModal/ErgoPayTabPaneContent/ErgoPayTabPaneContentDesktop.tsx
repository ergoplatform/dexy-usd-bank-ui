import {
  Animation,
  Button,
  Flex,
  Loading3QuartersOutlined,
  message,
  Space,
  Typography,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import styled from 'styled-components';

import {
  createErgoPayDeepLink,
  createSelectAddressesRequestLink,
} from '../../../../utils/ergopayLinks';
import { Disclaimer } from '../Disclaimer/Disclaimer';

type Props = {
  handleClick: () => void;
  loadingRequestId: boolean;
  requestId?: string;
};

const LargeLink = styled(Typography.Link)`
  font-size: 16px !important;
`;

export const ErgoPayTabPaneContentDesktop: FC<Props> = ({
  handleClick,
  loadingRequestId,
  requestId,
}) => {
  if (!requestId) {
    return null;
  }

  return (
    <Flex col justify="center">
      <Flex.Item marginTop={4}>
        <Disclaimer />
      </Flex.Item>
      <Space size={40} direction="vertical">
        <Flex.Item col display="flex" justify="center" marginTop={12}>
          <Flex.Item marginBottom={2} display="flex" justify="center">
            <Loading3QuartersOutlined
              style={{
                color: 'var(--spectrum-primary-text)',
                fontSize: '16px',
              }}
              spin={true}
            />
          </Flex.Item>
          <Typography.Body size="large" align="center">
            Waiting for connection with ErgoPay
          </Typography.Body>
        </Flex.Item>
        <Flex col>
          <Flex.Item marginBottom={2} alignSelf="center">
            <Typography.Title level={4}>Scan QR code</Typography.Title>
          </Flex.Item>
          <Flex.Item marginBottom={4} alignSelf="center">
            <div style={{ background: 'white', padding: '8px' }}>
              {requestId && (
                <QRCode
                  size={170}
                  value={createErgoPayDeepLink(
                    createSelectAddressesRequestLink(requestId),
                  )}
                />
              )}
            </div>
          </Flex.Item>
          <Flex.Item alignSelf="center" marginBottom={4}>
            <LargeLink
              href="https://ergoplatform.org/en/get-erg/#Wallets"
              target="_blank"
              rel="noreferrer"
            >
              Find an ErgoPay compatible wallet
            </LargeLink>
          </Flex.Item>
          <Flex.Item display="flex" align="center" width="100%">
            <Flex.Item marginRight={2} flex={1}>
              <CopyToClipboard
                text={createErgoPayDeepLink(
                  createSelectAddressesRequestLink(requestId),
                )}
                onCopy={() => message.success('Copied to clipboard!')}
              >
                <Button
                  type="default"
                  size="large"
                  width="100%"
                  disabled={loadingRequestId}
                >
                  Copy request
                </Button>
              </CopyToClipboard>
            </Flex.Item>
            <Flex.Item flex={1}>
              <Button
                type="primary"
                size="large"
                width="100%"
                onClick={handleClick}
              >
                Open external wallet
              </Button>
            </Flex.Item>
          </Flex.Item>
        </Flex>
      </Space>
    </Flex>
  );
};
