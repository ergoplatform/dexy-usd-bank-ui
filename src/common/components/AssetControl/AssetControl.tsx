import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Box,
  Button,
  Divider,
  Flex,
  Form,
  Typography,
  useFormContext,
} from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { balance$ } from '../../../api/balance/balance';
import { useObservable } from '../../hooks/useObservable';
import { Currency } from '../../models/Currency';
import {
  AssetAmountInput,
  TokenAmountInputValue,
} from './AssetAmountInput/AssetAmountInput';
import { AssetSelect } from './AssetSelect/AssetSelect';

export interface TokenControlValue {
  amount?: TokenAmountInputValue;
  asset?: AssetInfo;
}

export interface TokenControlProps {
  readonly label?: ReactNode;
  readonly value?: TokenControlValue;
  readonly onChange?: (value: TokenControlValue) => void;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export interface TokenControlFormItemProps {
  readonly name: string;
  readonly label?: ReactNode;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export interface AssetControlFormItemProps {
  readonly amountName?: string;
  readonly tokenName?: string;
  readonly maxButton?: boolean;
  readonly handleMaxButtonClick?: (balance: Currency) => Currency;
  readonly hasBorder?: boolean;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly bordered?: boolean;
  readonly label?: string;
  readonly loading?: boolean;
  readonly showBalances?: boolean;
  readonly disabled?: boolean;
  readonly getMaxAmount?: () => Currency | undefined;
}

export const AssetControlFormItem: FC<AssetControlFormItemProps> = ({
  amountName,
  tokenName,
  assetsToImport$,
  importedAssets$,
  readonly,
  loading,
  showBalances,
  disabled,
  label,
  getMaxAmount,
}) => {
  const { form } = useFormContext();
  const [balance] = useObservable(balance$);
  const [selectedAsset] = useObservable(
    tokenName
      ? form.controls[tokenName].valueChangesWithSilent$
      : of(undefined),
  );

  const isAmountReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'amount';
  };

  const isAssetReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'asset';
  };

  const handleMaxButtonClick = () => {
    if (getMaxAmount && amountName) {
      form.controls[amountName].patchValue(getMaxAmount());
    }
  };

  return (
    <Flex col>
      <Flex align="center" justify="space-between">
        {label && (
          <Flex.Item align="center">
            <Flex.Item flex={1}>
              <Typography.Body secondary>{label}</Typography.Body>
            </Flex.Item>
          </Flex.Item>
        )}
        {showBalances && balance && (
          <Form.Listener name={tokenName}>
            {({ value }) => (
              <Flex.Item justify="flex-end">
                <Typography.Body secondary>
                  Balance: {balance?.get(value).toString()}
                </Typography.Body>
              </Flex.Item>
            )}
          </Form.Listener>
        )}
      </Flex>
      <Flex.Item align="center" marginBottom={4}>
        <Flex.Item marginRight={2} flex={1}>
          {amountName && (
            <Form.Item name={amountName}>
              {({ value, onChange }) => (
                <AssetAmountInput
                  readonly={isAmountReadOnly() || loading}
                  value={value}
                  asset={selectedAsset}
                  onChange={onChange}
                  disabled={disabled}
                />
              )}
            </Form.Item>
          )}
        </Flex.Item>
        <Flex.Item marginLeft={2}>
          {tokenName && (
            <Form.Item name={tokenName}>
              {({ value }) => (
                <AssetSelect
                  loading={loading}
                  assetsToImport$={assetsToImport$}
                  importedAssets$={importedAssets$}
                  readonly={isAssetReadOnly()}
                  value={value}
                />
              )}
            </Form.Item>
          )}
        </Flex.Item>
      </Flex.Item>
    </Flex>
  );
};
