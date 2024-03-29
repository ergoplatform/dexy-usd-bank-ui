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
  MINTTX,
}

export interface ModalChainingPayload {
  readonly dexyAsset: Currency;
  readonly amountAsset?: Currency;
}

const getDescriptionByData = (
  operation: Operation,
  { dexyAsset, amountAsset }: ModalChainingPayload,
): ReactNode => {
  switch (operation) {
    case Operation.MINTTX:
      return amountAsset
        ? `Purchasing ${dexyAsset.toCurrencyString()} tokens for ${amountAsset.toCurrencyString()}`
        : '';
    case Operation.REDEEM: {
      return <>Claiming {dexyAsset.toCurrencyString()}</>;
    }
  }
};

const getErrorDescriptionByData = (
  operation: Operation,
  { dexyAsset, amountAsset }: ModalChainingPayload,
): ReactNode => {
  switch (operation) {
    case Operation.CONTRIBUTION:
      return (
        <>
          Can’t purchase {dexyAsset.toCurrencyString()} tokens for{' '}
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
      return <>Claiming {dexyAsset.toCurrencyString()}</>;
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
