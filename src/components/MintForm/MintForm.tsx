import { RustModule } from '@ergolabs/ergo-sdk';
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
import { FreeMint } from 'dexy-sdk-ts';
import React, { FC, ReactNode, useState } from 'react';
import { skip } from 'rxjs';

import { balance$, useAssetsBalance } from '../../api/balance/balance';
import { ergAsset } from '../../common/assets/ergAsset';
import { ergopadAsset } from '../../common/assets/ergopadAsset';
import { sigUsdAsset } from '../../common/assets/sigUsdAsset';
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
    mintAsset: sigUsdAsset,
  });

  const [balance] = useAssetsBalance();
  const oracleBox = RustModule.SigmaRust.ErgoBox.from_json(
    JSON.stringify({
      boxId: 'efc9ee45a7a4040df37347109e79354994d81e2b37b6f3f2329bda7e8934117e',
      value: 1000000,
      ergoTree: '10010101d17300',
      creationHeight: 123414,
      assets: [
        {
          tokenId:
            '472b4b6250655368566d597133743677397a24432646294a404d635166546a57',
          amount: 1,
        },
      ],
      additionalRegisters: {
        R4: '05a09c01',
      },
      transactionId:
        'f9e5ce5aa0d95f5d54a7bc89c46730d9662397067250aa18a0039631c0f5b808',
      index: 1,
    }),
  );
  const freeMint = new FreeMint();

  const pool = {
    calculateInputAmount: (value: Currency) => value,
  };
  // useSubscription(
  //   form.controls.baseAmount.valueChanges$.pipe(skip(1)),
  //   (value) => {
  //     if (value) {
  //       form.controls.mintAmount.patchValue(pool.calculateOutputAmount(value), {
  //         emitEvent: 'silent',
  //       });
  //     } else {
  //       form.controls.mintAmount.patchValue(undefined, { emitEvent: 'silent' });
  //     }
  //   },
  // );

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

  const amountRequiredValidator: OperationValidator<CommitmentFormModel> = (
    form,
  ) => (!form.value.baseAmount?.isPositive() ? 'Enter an amount' : undefined);

  const normalizedValidators = [amountRequiredValidator, ...validators];

  const submit = ({
    value: { baseAmount },
  }: FormGroup<CommitmentFormModel>) => {
    if (baseAmount) {
      setSubmitting(true);
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

  const getInsufficientTokenNameForFee = ({ baseAmount }: Required<any>) => {
    console.log(baseAmount);
    const totalFeesWithAmount = baseAmount.plus(2n); // TODO: change 2n to totalFee
    return false;
    // return totalFeesWithAmount.gt(balance.get(ergAsset)) ? true : false;
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
