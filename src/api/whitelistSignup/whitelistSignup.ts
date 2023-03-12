import axios from 'axios';
import { delay, from, Observable, of } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { Currency } from '../../common/models/Currency';

export const whitelistSignup = (
  eventName: string,
  address: string,
  amount: Currency,
): Observable<any> =>
  from(
    axios.post(`${applicationConfig.ergopadUrl}/whitelist/signup`, {
      name: '__anon_ergonaut',
      email: '',
      sigValue: Number(amount.toAmount()),
      ergoAddress: address,
      event: eventName,
    }),
  );
