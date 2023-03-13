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
import React, { FC, ReactNode, useState } from 'react';

import { ergAsset } from '../../common/assets/ergAsset';
import { ergopadAsset } from '../../common/assets/ergopadAsset';
import { sigUsdAsset } from '../../common/assets/sigUsdAsset';
import { AssetControlFormItem } from '../../common/components/AssetControl/AssetControl';
import {
  OperationForm,
  OperationValidator,
} from '../../common/components/OperationForm/OperationForm';
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

  return (
    <Box borderRadius="l" padding={4}>
      <OperationForm
        actionCaption={submitting ? 'Submitting' : 'Submit'}
        validators={normalizedValidators}
        form={form}
        submitting={submitting}
        onSubmit={submit}
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
              readonly="asset"
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
