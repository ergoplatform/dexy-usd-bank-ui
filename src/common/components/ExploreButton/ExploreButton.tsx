import { Address } from '@ergolabs/ergo-sdk';
import { Button, Tooltip } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

import { applicationConfig } from '../../../applicationConfig';
import { ReactComponent as ExploreIcon } from './icon-explore.svg';

interface ExploreButtonProps {
  to: Address;
  children?: ReactNode | ReactNode[] | string;
}

const exploreAddress = (address: Address): unknown =>
  window.open(
    `${applicationConfig.explorerUrl}/addresses/${address}`,
    '_blank',
  );

const ExploreButton: FC<ExploreButtonProps> = ({ to }) => {
  const handleExplore = (t: string): void => {
    exploreAddress(t);
  };

  return (
    <Tooltip title={`View on explorer.`} trigger="hover">
      <Button
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleExplore(to);
        }}
        style={{ lineHeight: '24px' }}
        icon={<ExploreIcon />}
      />
    </Tooltip>
  );
};

export { ExploreButton };
