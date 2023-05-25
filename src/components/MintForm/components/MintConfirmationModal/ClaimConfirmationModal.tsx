import { ErgoTx, UnsignedErgoTx } from '@ergolabs/ergo-sdk';
import { Box, Button, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { submitMintTx } from '../../../../common/operations/submitMintTx';
import { TxId } from '../../../../common/types';

export interface MintConfirmationModalProps {
  readonly onClose: (p: Observable<TxId>) => void;
  readonly tx: UnsignedErgoTx;
}

export const MintConfirmationModal: FC<MintConfirmationModalProps> = ({
  onClose,
  tx,
}) => {
  const contribute = () => {
    onClose(submitMintTx(tx));
  };

  return (
    <div>
      <Modal.Title>Mint confirmation</Modal.Title>
      <Modal.Content width="100%" maxWidth={400}>
        <Flex col>
          <Button
            size="large"
            htmlType="button"
            type="primary"
            width="100%"
            onClick={contribute}
          >
            Confirm
          </Button>
        </Flex>
      </Modal.Content>
    </div>
  );
};
