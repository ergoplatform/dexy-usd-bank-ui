import { applicationConfig } from '../../applicationConfig';
import { TxId } from '../types';

export const createUnsignedTxRequestLink = (txId: TxId): string =>
  `${applicationConfig.ergopayUrl}/unsignedTx/${txId}`;

export const createSelectAddressesRequestLink = (requestId: string): string =>
  `${applicationConfig.ergopayUrl}/addresses/${requestId}/#P2PK_ADDRESS#`;

export const createErgoPayDeepLink = (requestLink: string): string =>
  requestLink.replace('https', 'ergopay');
