import {
  ByteaConstant,
  DefaultBoxSelector,
  DefaultTxAssembler,
  fromHex,
  Int64Constant,
  RegisterId,
  RustModule,
  serializeConstant,
  UnsignedErgoTx,
} from '@ergolabs/ergo-sdk';
import { ErgoBoxCandidate } from '@ergolabs/ergo-sdk/build/main/entities/ergoBoxCandidate';
import { BoxSelection } from '@ergolabs/ergo-sdk/build/main/wallet/entities/boxSelection';
import { first, map, Observable, zip } from 'rxjs';

import { dexyGoldAsset } from '../../common/assets/dexyGoldAsset';
import { Currency } from '../../common/models/Currency';
import { networkAsset } from '../../common/services/networkAsset';
import { getErgoSigUsdRate } from '../ergoSigUsdRate/ergoSigUsdRate';
import { networkContext$ } from '../networkContext/networkContext';
import { utxos$ } from '../utxos/utxos';

const mainnetTxAssembler = new DefaultTxAssembler(true);

const contributeErgoTree =
  '1019040c0408040a040004000580dac40904000580dac40904000400040004020580ade20404000404058092f401040004000580bfd6060e20011d' +
  '3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f040201010402040001009593b1a57300d802d601b2a5730100d602b2a5' +
  '730200d196830301938cb2db6308b2a473030073040001e4c6a7060eed93c17201730593b1db630872017306ed93c17202730793b1db6308720273' +
  '08d809d601b2db6501fe730900d602db63087201d6038cb27202730a0001d604b2a5730b00d605ed93c17204730c93b1db63087204730dd606b2a5' +
  '730e00d607ed93c17206730f93b1db630872067310d608b2a5731100d609eded93c1720899c1a7731293db63087208db6308a793c27208e4c6a705' +
  '0e959372037313d19683040191e4c672010405e4c6a7040572057207720995937203e4c6a7060ed1968304019593b17202731473158f8cb2720273' +
  '1600028cb2db6308a773170002720572077209d17318';

const CONTRACT_FEE = 22000000n;
const NETWORK_FEE = 1000000n;

export const totalFees = new Currency(CONTRACT_FEE + NETWORK_FEE, networkAsset);

export const buildTx = (
  proxyNft: string,
  vestingAmount: Currency,
  amount: Currency,
  changeAddress: string,
  whitelistTokenId: string,
): Observable<UnsignedErgoTx> => {
  return zip([utxos$, networkContext$, getErgoSigUsdRate()]).pipe(
    first(),
    map(([utxos, networkContext, ergoUsdRate]) => {
      const vestingNErgAmount = amount.isAssetEquals(networkAsset)
        ? amount.amount
        : 0n;
      const vestingSigUsdAmount = amount.isAssetEquals(dexyGoldAsset)
        ? [{ tokenId: amount.asset.id, amount: amount.amount }]
        : [];

      const selection = DefaultBoxSelector.select(utxos, {
        nErgs: CONTRACT_FEE + NETWORK_FEE + vestingNErgAmount,
        assets: [
          {
            tokenId: whitelistTokenId,
            amount: vestingAmount.amount,
          },
        ].concat(vestingSigUsdAmount),
      });

      const proxyOutput: ErgoBoxCandidate = {
        assets: [
          {
            tokenId: whitelistTokenId,
            amount: vestingAmount.amount,
          },
        ].concat(vestingSigUsdAmount),
        ergoTree: contributeErgoTree,
        value: CONTRACT_FEE + vestingNErgAmount,
        creationHeight: networkContext.height,
        additionalRegisters: {
          [RegisterId.R4]: serializeConstant(
            new Int64Constant(
              BigInt(
                Math.floor(Number(ergoUsdRate.invertRatio().amount) * 1.01),
              ),
            ),
          ),
          [RegisterId.R5]: serializeConstant(
            new ByteaConstant(
              fromHex(
                RustModule.SigmaRust.Address.from_base58(changeAddress)
                  .to_ergo_tree()
                  .to_base16_bytes(),
              ),
            ),
          ),
          [RegisterId.R6]: serializeConstant(
            new ByteaConstant(fromHex(proxyNft)),
          ),
        },
      };

      const txRequest = mainnetTxAssembler.assemble(
        {
          dataInputs: [],
          inputs: selection as BoxSelection,
          feeNErgs: NETWORK_FEE,
          outputs: [proxyOutput],
          changeAddress: changeAddress,
        },
        networkContext as any,
      );

      if (txRequest.outputs.length === 3) {
        // @ts-ignore
        txRequest.outputs = [
          txRequest.outputs[0],
          txRequest.outputs[2],
          txRequest.outputs[1],
        ];
      }

      return txRequest;
    }),
  );
};
