import axios from 'axios';
import {
  distinctUntilChanged,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { sigUsdAsset } from '../../common/assets/sigUsdAsset';
import { Ratio } from '../../common/models/Ratio';
import { networkAsset } from '../../common/services/networkAsset';

export const getErgoSigUsdRate = () =>
  from(axios.get(`${applicationConfig.ergopadUrl}/asset/price/ergo`)).pipe(
    switchMap(() =>
      from(
        axios.get('https://oracle-core.ergopool.io/frontendData', {
          transformResponse: (data) => JSON.parse(JSON.parse(data)),
        }),
      ),
    ),
    map((res) => res.data.latest_price),
    distinctUntilChanged(),
    map(
      (latestPrice) =>
        new Ratio(latestPrice.toString(), sigUsdAsset, networkAsset),
    ),
    distinctUntilChanged(),
    publishReplay(1),
    refCount(),
  );
