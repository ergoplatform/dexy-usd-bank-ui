import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../models/AssetInfo';
import { AssetIcon } from '../AssetIcon/AssetIcon';

export interface TokenTitleProps {
  readonly asset: AssetInfo;
  readonly size?: 'large' | 'small' | 'extraSmall';
  readonly level?: 1 | 2 | 3 | 4 | 5 | 'body' | 'body-secondary' | undefined;
  readonly gap?: number;
}

export const AssetTitle: FC<TokenTitleProps> = ({
  asset,
  size,
  level = 5,
  gap = 1,
}) => (
  <Flex align="center">
    <Flex.Item marginRight={gap}>
      <AssetIcon size={size} asset={asset} />
    </Flex.Item>
    {level === 'body' || level === 'body-secondary' ? (
      <Typography.Body secondary={level === 'body-secondary'}>
        {asset.ticker || asset.name}
      </Typography.Body>
    ) : (
      <Typography.Title level={level}>
        {asset.ticker || asset.name}
      </Typography.Title>
    )}
  </Flex>
);
