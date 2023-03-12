import { Explorer } from '@ergolabs/ergo-sdk';

import { applicationConfig } from '../../../applicationConfig';

const explorer = new Explorer(applicationConfig.networkUrl);

export { explorer };
