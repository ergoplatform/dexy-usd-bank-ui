import {
  ergoBoxToProxy,
  ErgoTx,
  RustModule,
  UnsignedErgoTx,
} from '@ergolabs/ergo-sdk';
import {
  Box,
  Button,
  Flex,
  message,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import {
  ArbitrageMint,
  FreeMint,
  Mint,
  unsignedTxConnectorProxy,
} from 'dexy-sdk-ts';
import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { addresses$ } from '../../../../api/addresses/addresses';
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
  const [address] = useObservable(addresses$);
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
      arbitrageMintIn: RustModule.SigmaRust.ErgoBox.from_json(
        JSON.stringify(goldMintBox),
      ),
      lpIn: RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(lpBox)),
      tracking101: RustModule.SigmaRust.ErgoBox.from_json(
        JSON.stringify(trackingBox),
      ),
      oracleBox: RustModule.SigmaRust.ErgoBox.from_json(
        JSON.stringify(oracleBox),
      ),
      bankIn: RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(bankBox)),
      userIn: RustModule.SigmaRust.ErgoBoxes.from_boxes_json(
        utxos.map((utxo) => ergoBoxToProxy(utxo)),
      ),
      buybackBox: RustModule.SigmaRust.ErgoBox.from_json(
        JSON.stringify(buybackBox),
      ),
      freeMintBox: RustModule.SigmaRust.ErgoBox.from_json(
        JSON.stringify(freeMintBox),
      ),
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
        RustModule.SigmaRust.Address.from_base58(address[0]),
        txData.tracking101,
        networkContext.height,
      );

      const tx = unsignedTxConnectorProxy(arbitrageMintTX);

      onClose(submitMintTx(tx));
    } else {
      const freeMint = mint.getMintObject() as FreeMint;
      const freeMintTx = freeMint.createFreeMintTransaction(
        txData.txFee,
        Number(mintAmount.toAmount()),
        txData.freeMintBox,
        txData.buybackBox,
        txData.bankIn,
        txData.userIn,
        RustModule.SigmaRust.Address.from_base58(address[0]),
        networkContext.height,
      );
      const unsignedTx = unsignedTxConnectorProxy(freeMintTx);

      onClose(submitMintTx(unsignedTx));
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
