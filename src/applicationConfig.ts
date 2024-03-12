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
  readonly dexyTradeLink: string;
  readonly dexyProvideLiquidity: string;
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
  dexyTradeLink:
    'https://dexy.interface-ggd.pages.dev/ergo/swap?base=0000000000000000000000000000000000000000000000000000000000000000&quote=0d69a552b30df9be519099ec07682039b0610267aaee48d2a1d3dad398287ef5&initialPoolId=0fa04f3851b18085f160d90bc3dba1c63f2fdc73f884c9fd94395dbfc9c293b6',
  dexyProvideLiquidity:
    'https://dexy.interface-ggd.pages.dev/ergo/liquidity/0fa04f3851b18085f160d90bc3dba1c63f2fdc73f884c9fd94395dbfc9c293b6',
};
