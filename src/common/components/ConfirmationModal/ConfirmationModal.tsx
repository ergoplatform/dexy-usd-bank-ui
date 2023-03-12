import { TxId } from '@ergolabs/ergo-sdk';
import { Button, Flex, Modal, ModalRef, Typography } from '@ergolabs/ui-kit';
import { RequestProps } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';
import React, { ReactNode } from 'react';
import { TimeoutError } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { Currency } from '../../models/Currency';
import { ReactComponent as DiscordIcon } from './Discord.svg';
import { ReactComponent as TelegramIcon } from './Telegram.svg';

const exploreTx = (txId: TxId): unknown =>
  window.open(
    `${applicationConfig.explorerUrl}/transactions/${txId}`,
    '_blank',
  );

export enum Operation {
  CONTRIBUTION,
  REDEEM,
}

export interface ModalChainingPayload {
  readonly spfAsset: Currency;
  readonly amountAsset?: Currency;
}

const getDescriptionByData = (
  operation: Operation,
  { spfAsset, amountAsset }: ModalChainingPayload,
): ReactNode => {
  switch (operation) {
    case Operation.CONTRIBUTION:
      return amountAsset
        ? `Purchasing ${spfAsset.toCurrencyString()} tokens for ${amountAsset.toCurrencyString()}`
        : '';
    case Operation.REDEEM: {
      return <>Claiming {spfAsset.toCurrencyString()}</>;
    }
  }
};

const getErrorDescriptionByData = (
  operation: Operation,
  { spfAsset, amountAsset }: ModalChainingPayload,
): ReactNode => {
  switch (operation) {
    case Operation.CONTRIBUTION:
      return (
        <>
          Can’t purchase {spfAsset.toCurrencyString()} tokens for{' '}
          {amountAsset?.toCurrencyString()}. Try again later or{' '}
          <Button
            type="link"
            target="_blank"
            href="https://discord.gg/kGp44bdpq7"
            style={{
              display: 'inline-block',
              lineHeight: 0,
              height: 0,
              padding: 0,
            }}
          >
            contact us
          </Button>
          .
        </>
      );
    case Operation.REDEEM: {
      return <>Claiming {spfAsset.toCurrencyString()}</>;
    }
  }
};

const ProgressModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
) => {
  return (
    <Flex col align="center">
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>Waiting for confirmation</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body align="center">
          {getDescriptionByData(operation, payload)}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Body secondary align="center">
          Confirm this transaction in your wallet
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

const ErrorModalContent = (
  operation: Operation,
  payload: ModalChainingPayload,
) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        {getErrorDescriptionByData(operation, payload)}
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center" secondary>
        Transaction rejected
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center" secondary>
        Try again later
      </Typography.Body>
    </Flex.Item>
  </Flex>
);

const SuccessModalContent = (txId: TxId) => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Transaction submitted</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Link onClick={() => exploreTx(txId)}>
        View on Explorer
      </Typography.Link>
    </Flex.Item>
  </Flex>
);

const TimeoutModelContent = () => (
  <Flex col align="center">
    <Flex.Item marginBottom={1}>
      <Typography.Title level={4}>Error</Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">Timeout error</Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">Try again later</Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1}>
      <Typography.Body align="center">
        Get help in our channels:
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={1} justify="center">
      <Flex>
        <Flex.Item marginRight={1}>
          <a
            style={{ color: 'var(--spectrum-primary-color)' }}
            href={applicationConfig.support.discord}
            target="_blank"
            rel="noreferrer"
          >
            <DiscordIcon style={{ cursor: 'pointer' }} />
          </a>
        </Flex.Item>
        <Flex.Item>
          <a
            style={{ color: 'var(--spectrum-primary-color)' }}
            href={applicationConfig.support.telegram}
            target="_blank"
            rel="noreferrer"
          >
            <TelegramIcon style={{ cursor: 'pointer' }} />
          </a>
        </Flex.Item>
      </Flex>
    </Flex.Item>
  </Flex>
);

export const openConfirmationModal = (
  actionContent: RequestProps['actionContent'],
  operation: Operation,
  payload: ModalChainingPayload,
): ModalRef => {
  return Modal.request({
    actionContent,
    errorContent: (error: Error) => {
      if (error instanceof TimeoutError) {
        return TimeoutModelContent();
      }
      return ErrorModalContent(operation, payload);
    },
    progressContent: ProgressModalContent(operation, payload),
    successContent: SuccessModalContent,
  });
};
