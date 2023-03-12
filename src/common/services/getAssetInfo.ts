import { AugAssetInfo } from '@ergolabs/ergo-sdk/build/main/network/models';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { explorer } from '../../api/wallet/common/explorer';
import { applicationConfig } from '../../applicationConfig';
import { AssetInfo } from '../models/AssetInfo';
import { defaultTokenList$ } from './defaultTokenList';
import { networkAsset } from './networkAsset';

const mapDefaultTokenListItemToAssetInfoById = (
  assetId: string,
): Observable<AssetInfo | undefined> =>
  defaultTokenList$.pipe(
    map((dtl) => dtl.tokensMap.get(assetId)),
    map((item) =>
      item
        ? {
            id: item.address,
            name: item.name,
            decimals: item.decimals,
            ticker: item.ticker,
            icon:
              item.logoURI ||
              `${applicationConfig.metadataUrl}/light/${item.address}.svg`,
            iconFallback: item.logoURI
              ? `${applicationConfig.metadataUrl}/light/${item.address}.svg`
              : undefined,
            description: '',
          }
        : undefined,
    ),
  );

const mapFullTokenInfoToAssetItemById = (
  assetId: string,
): Observable<AssetInfo | undefined> =>
  from(explorer.getFullTokenInfo(assetId)).pipe(
    catchError(() => of(undefined)),
    map<AugAssetInfo | undefined, AssetInfo | undefined>((item) =>
      item
        ? {
            id: item.id,
            name: undefined,
            decimals: item.decimals,
            ticker: item.name,
            icon: `${applicationConfig.metadataUrl}/light/${item.id}.svg`,
            iconFallback: undefined,
            description: item.description,
            emissionAmount: item.emissionAmount,
          }
        : undefined,
    ),
  );

const assetInfoCache = new Map<string, Observable<AssetInfo | undefined>>();

export const mapToAssetInfo = (
  assetId: string,
): Observable<AssetInfo | undefined> => {
  if (assetId === networkAsset.id) {
    return of(networkAsset);
  }

  if (assetInfoCache.has(assetId)) {
    return assetInfoCache.get(assetId)!;
  }

  return mapDefaultTokenListItemToAssetInfoById(assetId).pipe(
    switchMap((assetInfo) =>
      assetInfo ? of(assetInfo) : mapFullTokenInfoToAssetItemById(assetId),
    ),
    tap((assetInfo) => {
      assetInfoCache.set(assetId, new BehaviorSubject(assetInfo));
    }),
  );
};
