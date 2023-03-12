import { TokenId } from '@ergolabs/ergo-sdk';
import { map, Observable } from 'rxjs';

import { ergAsset } from '../../common/assets/ergAsset';
import { Currency } from '../../common/models/Currency';
import { balance$ } from '../balance/balance';

export const getWhitelistTokenBalance = (
  id: TokenId,
): Observable<Currency | undefined> => {
  return balance$.pipe(
    map((balance) => balance.getById(id)),
    map((whitelistTokenBalance) =>
      whitelistTokenBalance
        ? new Currency(whitelistTokenBalance.amount, ergAsset)
        : undefined,
    ),
  );
};
