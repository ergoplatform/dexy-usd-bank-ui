import {
  DefaultTxAssembler,
  ergoBoxToProxy,
  RustModule,
} from '@ergolabs/ergo-sdk';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  Box,
  Flex,
  FormGroup,
  notification,
  SwapOutlined,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { FreeMint, unsignedTxConnectorProxy } from 'dexy-sdk-ts';
import React, { FC, ReactNode, useState } from 'react';
import { skip } from 'rxjs';

import { addresses$ } from '../../api/addresses/addresses';
import { balance$, useAssetsBalance } from '../../api/balance/balance';
import { networkContext$ } from '../../api/networkContext/networkContext';
import { utxos$ } from '../../api/utxos/utxos';
import { selectedWallet$ } from '../../api/wallet/wallet';
import { dexyGoldAsset } from '../../common/assets/dexyGoldAsset';
import { ergAsset } from '../../common/assets/ergAsset';
import { ergopadAsset } from '../../common/assets/ergopadAsset';
import { AssetControlFormItem } from '../../common/components/AssetControl/AssetControl';
import {
  OperationForm,
  OperationValidator,
} from '../../common/components/OperationForm/OperationForm';
import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { proverMediator } from '../../common/operations/proverMediator';
import { useGold101 } from '../../hooks/useGold101';
import { useGoldBank } from '../../hooks/useGoldBank';
import { useGoldBuyback } from '../../hooks/useGoldBuyback';
import { useGoldLp } from '../../hooks/useGoldLp';
import { useGoldMintArbitrage } from '../../hooks/useGoldMintArbitrage';
import { useGoldMintFree } from '../../hooks/useGoldMintFree';
import { useGoldOracle } from '../../hooks/useGoldOracle';
import { SwitchButton } from './SwitchButton/SwitchButton';

export interface CommitmentFormProps {
  readonly validators?: OperationValidator<CommitmentFormModel>[];
}

export interface CommitmentFormModel {
  readonly baseAsset: AssetInfo;
  readonly mintAsset: AssetInfo;
  readonly baseAmount?: Currency;
  readonly mintAmount?: Currency;
}

export const MintForm: FC<CommitmentFormProps> = ({ validators = [] }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form = useForm<CommitmentFormModel>({
    baseAmount: undefined,
    baseAsset: ergAsset,
    mintAmount: undefined,
    mintAsset: dexyGoldAsset,
  });

  const [balance] = useAssetsBalance();
  const [utxos] = useObservable(utxos$);
  const [address] = useObservable(addresses$);
  const [networkContext] = useObservable(networkContext$);
  const [wallet] = useObservable(selectedWallet$);
  const [lpBox, lpBoxError, lpBoxLoading, refetchLpBox] = useGoldLp();
  const [
    freeMintBox,
    freeMintBoxError,
    freeMintBoxLoading,
    refetchFreeMintBox,
  ] = useGoldMintFree();
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

  // const oracleBox = RustModule.SigmaRust.ErgoBox.from_json(
  //   JSON.stringify({
  //     boxId: 'efc9ee45a7a4040df37347109e79354994d81e2b37b6f3f2329bda7e8934117e',
  //     value: 1000000,
  //     ergoTree: '10010101d17300',
  //     creationHeight: 123414,
  //     assets: [
  //       {
  //         tokenId:
  //           '472b4b6250655368566d597133743677397a24432646294a404d635166546a57',
  //         amount: 1,
  //       },
  //     ],
  //     additionalRegisters: {
  //       R4: '05a09c01',
  //     },
  //     transactionId:
  //       'f9e5ce5aa0d95f5d54a7bc89c46730d9662397067250aa18a0039631c0f5b808',
  //     index: 1,
  //   }),
  // );
  const pool = {
    calculateInputAmount: (value: Currency) =>
      new Currency(value.plus(200n).amount, ergAsset),
  };

  useSubscription(
    form.controls.mintAmount.valueChanges$.pipe(skip(1)),
    (value) => {
      if (value) {
        form.controls.baseAmount.patchValue(pool.calculateInputAmount(value), {
          emitEvent: 'silent',
        });
      } else {
        form.controls.baseAmount.patchValue(undefined, { emitEvent: 'silent' });
      }
    },
  );

  if (
    !lpBox ||
    !freeMintBox ||
    !oracleBox ||
    !bankBox ||
    !buybackBox ||
    !trackingBox ||
    !utxos ||
    !address ||
    !networkContext
  ) {
    return null;
  }
  const data = {
    txFee: 1000000,
    arbitrageMintIn: RustModule.SigmaRust.ErgoBox.from_json(
      JSON.stringify(freeMintBox),
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
  };
  const amountRequiredValidator: OperationValidator<CommitmentFormModel> = (
    form,
  ) => (!form.value.baseAmount?.isPositive() ? 'Enter an amount' : undefined);

  const normalizedValidators = [amountRequiredValidator, ...validators];

  const submit = ({
    value: { baseAmount, mintAmount },
  }: FormGroup<CommitmentFormModel>) => {
    if (baseAmount && mintAmount) {
      const freeMint = new FreeMint();

      const freeMintTx = freeMint.createFreeMintTransaction(
        data.txFee,
        mintAmount.amount,
        data.arbitrageMintIn,
        data.buybackBox,
        data.bankIn,
        data.userIn,
        data.lpIn,
        RustModule.SigmaRust.Address.from_base58(address[0]),
        data.oracleBox,
        networkContext?.height,
      );
      const unsignedTx = unsignedTxConnectorProxy(freeMintTx);
      proverMediator
        .sign(unsignedTx)
        .then((x) => {
          console.log('tx ', x);
        })
        .catch((e) => {
          console.log('error ', e);
        });
      // setSubmitting(true);
    }
  };

  const isAmountNotEntered = ({ baseAmount, mintAmount }: any) => {
    if (
      (!baseAmount?.isPositive() && mintAmount?.isPositive()) ||
      (!mintAmount?.isPositive() && baseAmount?.isPositive())
    ) {
      return false;
    }

    return !baseAmount?.isPositive() || !mintAmount?.isPositive();
  };

  const getInsufficientTokenNameForFee = (props: Required<any>) => {
    const { baseAmount } = props;
    const totalFeesWithAmount = baseAmount.plus(2n); // TODO: change 2n to totalFee

    return totalFeesWithAmount.gt(balance.get(ergAsset)) ? true : false;
  };

  return (
    <Box borderRadius="l" padding={4}>
      <OperationForm
        actionCaption={submitting ? 'Submitting' : 'Submit'}
        validators={normalizedValidators}
        form={form}
        submitting={submitting}
        onSubmit={submit}
        getInsufficientTokenNameForFee={getInsufficientTokenNameForFee}
        isAmountNotEntered={isAmountNotEntered}
      >
        <Flex col>
          <Flex.Item marginBottom={6}>
            <Typography.Title level={4}>Mint DexyGold</Typography.Title>
          </Flex.Item>
          <Flex.Item>
            <AssetControlFormItem
              showBalances
              disabled
              bordered={false}
              amountName="baseAmount"
              tokenName="baseAsset"
              readonly="amount"
              label="ERG deposit"
            />
          </Flex.Item>

          <SwitchButton icon={<ArrowLeftOutlined />} size="middle" />

          <Flex.Item>
            <AssetControlFormItem
              showBalances
              bordered={false}
              amountName="mintAmount"
              tokenName="mintAsset"
              readonly="asset"
              label="To mint"
            />
          </Flex.Item>
        </Flex>
      </OperationForm>
      <Flex.Item marginTop={4} justify="center">
        <Typography.Text type="secondary" style={{ color: '#8A8A8A' }}>
          Powered by Spectrum Finance liquidity pools
        </Typography.Text>
      </Flex.Item>
    </Box>
  );
};
