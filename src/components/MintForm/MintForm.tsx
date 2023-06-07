import { RustModule } from '@ergolabs/ergo-sdk';
import {
  ArrowLeftOutlined,
  Box,
  CheckCircleOutlined,
  Flex,
  FormGroup,
  Tag,
  Tooltip,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { ArbitrageMint } from 'dexy-sdk-ts';
import React, { FC, ReactNode, useState } from 'react';
import { skip } from 'rxjs';

import { balance$, useAssetsBalance } from '../../api/balance/balance';
import { selectedWallet$ } from '../../api/wallet/wallet';
import { dexyGoldAsset } from '../../common/assets/dexyGoldAsset';
import { ergAsset } from '../../common/assets/ergAsset';
import { AssetControlFormItem } from '../../common/components/AssetControl/AssetControl';
import {
  openConfirmationModal,
  Operation,
} from '../../common/components/ConfirmationModal/ConfirmationModal';
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
import { useGoldLp } from '../../hooks/useGoldLp';
import { useGoldOracle } from '../../hooks/useGoldOracle';
import { MintConfirmationModal } from './components/MintConfirmationModal/ClaimConfirmationModal';
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

  const [balance] = useAssetsBalance();
  const form = useForm<CommitmentFormModel>({
    baseAmount: undefined,
    baseAsset: ergAsset,
    mintAmount: undefined,
    mintAsset: dexyGoldAsset,
  });
  const [oracle] = useGoldOracle();
  const [lpBox] = useGoldLp();
  const arbitrageMint = new ArbitrageMint();
  const isMintAvailable =
    oracle && lpBox
      ? arbitrageMint.lpRate(
          RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(lpBox)),
        ) >
        arbitrageMint.oracleRate(
          RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(oracle)),
        )
      : false;

  const pool = {
    calculateInputAmount: (value: Currency) => {
      return new Currency(
        arbitrageMint.ergNeeded(
          value.amount.toString(),
          RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(oracle)),
        ),
        ergAsset,
      );
    },
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
    [oracle],
  );

  const amountRequiredValidator: OperationValidator<CommitmentFormModel> = (
    form,
  ) => (!form.value.baseAmount?.isPositive() ? 'Enter an amount' : undefined);

  const normalizedValidators = [amountRequiredValidator, ...validators];

  const submit = ({
    value: { baseAmount, mintAmount },
  }: FormGroup<CommitmentFormModel>) => {
    if (baseAmount && mintAmount) {
      openConfirmationModal(
        (next) => (
          <MintConfirmationModal
            onClose={next}
            mintAmount={mintAmount}
            baseAmount={baseAmount}
          />
        ),
        Operation.MINTTX,
        { dexyAsset: mintAmount, amountAsset: baseAmount },
      );
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
    let totalFeesWithAmount;

    if (baseAmount) {
      totalFeesWithAmount = baseAmount.plus(1000000n);
    } else {
      totalFeesWithAmount = new Currency(0n, ergAsset);
    }

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
        isMintAvailable={isMintAvailable}
      >
        <Flex col>
          <Flex.Item marginBottom={6} justify="space-between">
            <Typography.Title level={4}>Mint DexyGold</Typography.Title>
            <div>
              <Tooltip title="Oracle price is less than the Liquidity pool price.">
                <Tag
                  icon={<CheckCircleOutlined />}
                  color={'success'}
                  style={{ height: '24px' }}
                >
                  Available
                </Tag>
              </Tooltip>
            </div>
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
