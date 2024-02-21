import { DateTime } from 'luxon';

export interface ApplicationConfig {
  readonly updateTime: number;
  readonly idoStart: DateTime;
  readonly networkUrl: string;
  readonly metadataUrl: string;
  readonly defaultTokenListUrl: string;
  readonly ergopayUrl: string;
  readonly ergopadUrl: string;
  readonly applicationTick: number;
  readonly explorerUrl: string;
  readonly spectrumUrl: string;
  readonly dexybankUrl: string;
  readonly dexyOraclePool: string;
}

export const applicationConfig: ApplicationConfig = {
  applicationTick: 5000,
  explorerUrl: 'https://testnet.ergoplatform.com',
  ergopayUrl: 'https://ergopay-backend.fly.dev',
  defaultTokenListUrl:
    'https://raw.githubusercontent.com/ergolabs/default-token-list/master/src/tokens',
  spectrumUrl: ' https://api.spectrum.fi/v1/',
  networkUrl: 'https://api-testnet.ergoplatform.com',
  metadataUrl:
    'https://raw.githubusercontent.com/ergolabs/ergo-dex-asset-icons/master',
  ergopadUrl: 'https://api.ergopad.io',
  updateTime: 1000,
  idoStart: DateTime.utc(2023, 1, 16, 20, 0),
  dexybankUrl: 'https://api-testnet.dexygold.com/api',
  dexyOraclePool:
    'https://explorer.ergoplatform.com/en/oracle-pool-state/xauerg',
};
