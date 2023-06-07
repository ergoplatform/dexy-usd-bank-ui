import { Button, Flex, Form, FormGroup } from '@ergolabs/ui-kit';
import React, { ReactNode, useEffect, useState } from 'react';
import { debounceTime, first, Observable } from 'rxjs';

import { balance$ } from '../../../api/balance/balance';
// import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { useObservable } from '../../hooks/useObservable';
import { isOnline$ } from '../../streams/networkConnection';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';

export type OperationValidator<T> = (
  form: FormGroup<T>,
) => ReactNode | ReactNode[] | string | undefined;

export interface OperationFormProps<T> {
  readonly validators?: OperationValidator<T>[];
  readonly form: FormGroup<T>;
  readonly actionCaption: ReactNode | ReactNode[] | string;
  readonly onSubmit: (
    form: FormGroup<T>,
  ) => Observable<any> | void | Promise<any>;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly submitting?: boolean;
  readonly isMintAvailable?: boolean;
  readonly getInsufficientTokenNameForFee: (value: any) => boolean;
  readonly isAmountNotEntered: (value: any) => boolean;
}

const CHECK_INTERNET_CONNECTION_CAPTION = `Check Internet Connection`;
const LOADING_WALLET_CAPTION = `Loading`;
const INSUFFICIENT_TOKEN_BALANCE = `Insufficient ERG Balance`;
const AMOUNT_NOT_ENTERED = `Enter amount`;
const MINT_IS_NOT_AVAILABLE = 'Mint is not available';

export function OperationForm<T>({
  validators,
  form,
  onSubmit,
  children,
  actionCaption,
  submitting,
  getInsufficientTokenNameForFee,
  isAmountNotEntered,
  isMintAvailable,
}: OperationFormProps<T>): JSX.Element {
  const [isOnline] = useObservable(isOnline$);
  const [, isBalanceLoading] = useObservable(balance$);
  const [value] = useObservable(
    form.valueChangesWithSilent$.pipe(debounceTime(100)),
    [form],
    {} as any,
  );
  const [{ loading, disabled, caption }, setButtonProps] = useState<{
    loading: boolean;
    disabled: boolean;
    caption: ReactNode | ReactNode[] | string;
  }>({
    loading: false,
    disabled: true,
    caption: CHECK_INTERNET_CONNECTION_CAPTION,
  });

  useEffect(() => {
    if (!isOnline) {
      setButtonProps({
        disabled: true,
        loading: false,
        caption: CHECK_INTERNET_CONNECTION_CAPTION,
      });
    } else if (isMintAvailable) {
      setButtonProps({
        disabled: true,
        loading: false,
        caption: MINT_IS_NOT_AVAILABLE,
      });
    } else if (isBalanceLoading) {
      setButtonProps({
        disabled: false,
        loading: true,
        caption: LOADING_WALLET_CAPTION,
      });
    } else if (isAmountNotEntered && isAmountNotEntered(value)) {
      setButtonProps({
        disabled: true,
        loading: false,
        caption: AMOUNT_NOT_ENTERED,
      });
    } else if (
      getInsufficientTokenNameForFee &&
      getInsufficientTokenNameForFee(value)
    ) {
      setButtonProps({
        caption: INSUFFICIENT_TOKEN_BALANCE,
        disabled: true,
        loading: false,
      });
    } else {
      const caption = validators?.map((v) => v(form)).find(Boolean);

      setButtonProps({
        disabled: !!caption,
        loading: false,
        caption: caption || actionCaption,
      });
    }
  }, [isOnline, value, validators, actionCaption, isBalanceLoading]);

  const handleSubmit = () => {
    if (loading || disabled) {
      return;
    }
    const result = onSubmit(form);

    if (result instanceof Observable) {
      result.pipe(first()).subscribe();
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Flex col>
        {children}
        <Flex.Item marginTop={6}>
          <ConnectWalletButton
            caption="Connect wallet"
            size="large"
            width="100%"
          >
            <Button
              loading={loading || submitting}
              disabled={disabled}
              type="primary"
              size="extra-large"
              width="100%"
              htmlType="submit"
            >
              {caption}
            </Button>
          </ConnectWalletButton>
        </Flex.Item>
      </Flex>
    </Form>
  );
}
