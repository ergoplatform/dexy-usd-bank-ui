import { Observable, of, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { AssetInfo } from '../models/AssetInfo';

export const ERG_DECIMALS = 9;

export const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export const networkAsset: AssetInfo = {
  name: 'Ergo',
  ticker: 'ERG',
  icon: `${applicationConfig.metadataUrl}/light/${ERGO_ID}.svg`,
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);
