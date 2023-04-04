import { Box, Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import React from 'react';

import { ReactComponent as OpenIcon } from '../../assets/OpeninNew.svg';

const BankInfo = () => {
  const { valBySize } = useDevice();
  return (
    <Box borderRadius={'xl'} padding={4}>
      <Flex.Item justify="space-between" marginBottom={valBySize(1, 2)}>
        <Typography.Link
          style={{ fontSize: valBySize('12px', '14px', '16px') }}
        >
          <Flex align="center" gap={0.5}>
            Oracle price
            <OpenIcon />
          </Flex>
        </Typography.Link>
        <div>
          <Typography.Body
            style={{ fontSize: valBySize('12px', '14px', '16px') }}
          >
            1 DexyGOLD = 32,456.29 ERG
          </Typography.Body>
        </div>
      </Flex.Item>
      <Flex.Item justify="space-between">
        <div>
          <Typography.Link
            style={{ fontSize: valBySize('12px', '14px', '16px') }}
          >
            <Flex align="center" gap={0.5}>
              Liquidity pool price
              <OpenIcon />
            </Flex>
          </Typography.Link>
        </div>
        <div>
          <Typography.Body
            style={{ fontSize: valBySize('12px', '14px', '16px') }}
          >
            1 DexyGOLD = 32,456.29 ERG
          </Typography.Body>
        </div>
      </Flex.Item>
    </Box>
  );
};

export default BankInfo;
