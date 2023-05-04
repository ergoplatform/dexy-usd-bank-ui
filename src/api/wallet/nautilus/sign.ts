import { ErgoTx, ergoTxFromProxy } from '@ergolabs/ergo-sdk';

export const sign = async (tx: any): Promise<ErgoTx> => {
  const res = await ergoConnector.nautilus
    .getContext()
    .then((context) => context.sign_tx(tx));
  return ergoTxFromProxy(res);
};
