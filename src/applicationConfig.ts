import { DateTime } from 'luxon';

import { types } from './common/utils/types';

export interface ApplicationConfig {
  readonly lowBalanceGuide: string;
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
  readonly support: {
    readonly discord: string;
    readonly telegram: string;
  };
}

export const applicationConfig: ApplicationConfig = {
  applicationTick: 5_000,
  explorerUrl: 'https://explorer.ergoplatform.com',
  ergopayUrl: 'https://ergopay-backend.fly.dev',
  lowBalanceGuide:
    'https://docs.spectrum.fi/docs/user-guides/quick-start#3-get-assets',
  defaultTokenListUrl:
    'https://raw.githubusercontent.com/ergolabs/default-token-list/master/src/tokens',
  spectrumUrl: ' https://api.spectrum.fi/v1/',
  networkUrl: 'https://api.ergoplatform.com',
  metadataUrl:
    'https://raw.githubusercontent.com/ergolabs/ergo-dex-asset-icons/master',
  ergopadUrl: 'https://api.ergopad.io',
  updateTime: 1_000,
  support: {
    discord: 'https://discord.com/invite/zY2gmTYQVD',
    telegram: 'https://t.me/spectrum_labs_community',
  },
  idoStart: DateTime.utc(2023, 1, 16, 20, 0),
};
