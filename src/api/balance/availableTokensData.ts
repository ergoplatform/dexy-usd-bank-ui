import { ErgoBox, TokenId } from '@ergolabs/ergo-sdk';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { utxos$ } from '../utxos/utxos';

export interface Asset extends AssetInfo {
  amount: bigint;
}

export type AssetDictionary = Record<TokenId, Asset>;

export const getListAvailableTokens = (boxes: ErgoBox[]): AssetDictionary => {
  const assetDict: AssetDictionary = {};
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = 0; j < boxes[i].assets.length; j += 1) {
      const { tokenId, amount, decimals, name } = boxes[i].assets[j];

      if (tokenId in assetDict) {
        assetDict[tokenId].amount += amount;
      } else {
        assetDict[tokenId] = {
          amount,
          id: tokenId,
          decimals,
          ticker: name,
          name,
        };
      }
    }
  }

  return assetDict;
};

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

export const availableTokensData$: Observable<[bigint, AssetInfo][]> =
  utxos$.pipe(
    map(toListAvailableTokens),
    map((boxAssets) =>
      boxAssets.map((ba) => [ba.amount, ba] as [bigint, AssetInfo]),
    ),
    publishReplay(1),
    refCount(),
  );
