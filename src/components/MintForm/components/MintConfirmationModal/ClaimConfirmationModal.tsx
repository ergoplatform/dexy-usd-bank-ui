import { ergoBoxToProxy, UnsignedErgoTx } from '@ergolabs/ergo-sdk';
import {
  Box,
  Button,
  Flex,
  message,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { ErgoAddress } from '@fleet-sdk/core';
import { ArbitrageMint, FreeMint, Mint } from 'dexy-sdk-ts';
import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { getAddresses } from '../../../../api/addresses/addresses';
import { useAssetsBalance } from '../../../../api/balance/balance';
import { networkContext$ } from '../../../../api/networkContext/networkContext';
import { utxos$ } from '../../../../api/utxos/utxos';
import { selectedWallet$ } from '../../../../api/wallet/wallet';
import { CurrencyPreview } from '../../../../common/components/CurrencyPreview/CurrencyPreview';
import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { submitMintTx } from '../../../../common/operations/submitMintTx';
import { TxId } from '../../../../common/types';
import { MintType } from '../../../../common/utils/types';
import { useGold101 } from '../../../../hooks/useGold101';
import { useGoldBank } from '../../../../hooks/useGoldBank';
import { useGoldBuyback } from '../../../../hooks/useGoldBuyback';
import { useGoldLp } from '../../../../hooks/useGoldLp';
import { useGoldMintArbitrage } from '../../../../hooks/useGoldMintArbitrage';
import { useGoldMintFree } from '../../../../hooks/useGoldMintFree';
import { useGoldOracle } from '../../../../hooks/useGoldOracle';

export interface MintConfirmationModalProps {
  readonly onClose: (p: Observable<TxId>) => void;
  readonly mintAmount: Currency;
  readonly baseAmount: Currency;
}

export const MintConfirmationModal: FC<MintConfirmationModalProps> = ({
  onClose,
  mintAmount,
  baseAmount,
}) => {
  const [utxos] = useObservable(utxos$);
  const [address] = useObservable(getAddresses());
  const [networkContext] = useObservable(networkContext$);
  const [lpBox, lpBoxError, lpBoxLoading, refetchLpBox] = useGoldLp();
  const [
    freeMintBox,
    freeMintBoxError,
    freeMintBoxLoading,
    refetchFreeMintBox,
  ] = useGoldMintFree();
  const [
    goldMintBox,
    goldMintBoxError,
    goldMintBoxLoading,
    refetchGoldMintBox,
  ] = useGoldMintArbitrage();
  const [buybackBox, buybackBoxError, buybackBoxLoading, refetchBuybackBox] =
    useGoldBuyback();
  const [bankBox, bankBoxError, bankBoxLoading, refetchBankBox] = useGoldBank();
  const [oracleBox, oracleBoxError, oracleBoxLoading, refetchOracleBox] =
    useGoldOracle();
  const [
    trackingBox,
    trackingBoxError,
    trackingBoxLoading,
    refetchTrackingBox,
  ] = useGold101();

  const isButtonDisabled =
    !lpBox ||
    !goldMintBox ||
    !oracleBox ||
    !bankBox ||
    !buybackBox ||
    !trackingBox ||
    !utxos ||
    !address ||
    !networkContext ||
    !freeMintBox;
  const contribute = () => {
    if (isButtonDisabled) {
      return;
    }

    const txData = {
      txFee: 1000000,
      arbitrageMintIn: goldMintBox,
      freeMintBox: freeMintBox,
      lpIn: lpBox,
      tracking101: trackingBox,
      oracleBox: oracleBox,
      bankIn: bankBox,
      userIn: utxos.map((utxo) => ergoBoxToProxy(utxo) as any),
      buybackBox: buybackBox,
    };

    const mint = new Mint(txData.oracleBox, txData.lpIn);

    if (mint.mintType() === MintType.arbMint) {
      const arbMint = mint.getMintObject() as ArbitrageMint;
      const arbitrageMintTX = arbMint.createArbitrageMintTransaction(
        txData.txFee,
        Number(mintAmount.toAmount()),
        txData.arbitrageMintIn,
        txData.buybackBox,
        txData.bankIn,
        txData.userIn,
        ErgoAddress.fromBase58(address[0]),
        txData.tracking101,
        networkContext.height,
      );

      const unsignedArbMintTx = arbitrageMintTX as unknown as UnsignedErgoTx;

      onClose(submitMintTx(unsignedArbMintTx));
    } else {
      const freeMint = mint.getMintObject() as FreeMint;
      const freeMintTx = freeMint.createFreeMintTransaction(
        txData.txFee,
        Number(mintAmount.toAmount()),
        txData.freeMintBox,
        txData.buybackBox,
        txData.bankIn,
        txData.userIn,
        ErgoAddress.fromBase58(address[0]),
        networkContext.height,
      );
      const unsignedFreeMintTx =
        freeMintTx.toEIP12Object() as unknown as UnsignedErgoTx;

      onClose(submitMintTx(unsignedFreeMintTx));
    }
  };

  return (
    <div>
      <Modal.Title>Mint confirmation</Modal.Title>
      <Modal.Content width="100%" maxWidth={400}>
        <Flex col>
          <Flex.Item marginBottom={1}>
            <CurrencyPreview value={baseAmount} />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <CurrencyPreview value={mintAmount} />
          </Flex.Item>
          <Button
            size="large"
            htmlType="button"
            type="primary"
            width="100%"
            onClick={contribute}
            disabled={isButtonDisabled}
          >
            Confirm
          </Button>
        </Flex>
      </Modal.Content>
    </div>
  );
};
