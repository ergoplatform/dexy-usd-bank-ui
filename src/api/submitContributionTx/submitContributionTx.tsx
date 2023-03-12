import { filter, first, Observable, switchMap, tap, zip } from 'rxjs';

import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { selectedWallet$ } from '../wallet/wallet';
import { buildTx } from './buildTx';

export interface SubmitContributionTxRequest {
  readonly proxyNft: string;
  readonly vestingAmount: Currency;
  readonly sigUsdAmount?: Currency;
  readonly whitelistTokenId: string;
}

export const submitContributionTx = ({
  proxyNft,
  vestingAmount,
  sigUsdAmount,
  whitelistTokenId,
}: SubmitContributionTxRequest): Observable<TxId> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => {
      return zip(w.getChangeAddress(), w.getAddresses()).pipe(
        switchMap(([changeAddress]) =>
          buildTx(
            proxyNft,
            vestingAmount,
            sigUsdAmount!,
            changeAddress,
            whitelistTokenId,
          ),
        ),
        // switchMap(([changeAddress, addresses]) => {
        //   return axios.post(
        //     `${applicationConfig.ergopadUrl}/vesting/contribute`,
        //     {
        //       proxyNFT: proxyNft,
        //       vestingAmount: Number(vestingAmount.toAmount()),
        //       sigUSDAmount: sigUsdAmount?.isAssetEquals(sigUsdAsset)
        //         ? Number(sigUsdAmount.toAmount())
        //         : 0,
        //       address: changeAddress,
        //       utxos: [],
        //       addresses,
        //       txFormat: 'eip-12',
        //     },
        //   );
        // }),
        // map((res) => res.data),
        tap(console.log),
        switchMap((tx) => w.sign(tx)),
        switchMap((signedTx) => w.submitTx(signedTx)),
      );
    }),
  );

// axios.post(`${applicationConfig.ergopadUrl}`, {});
