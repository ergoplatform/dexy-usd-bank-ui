import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { ReactComponent as OpenIcon } from '../../assets/OpeninNew.svg';

const TradeInfo = () => {
  return (
    <Box borderRadius={'xl'} padding={4}>
      <Flex.Item justify="center" marginBottom={2} gap={6}>
        <Flex.Item marginRight={20}>
          <Typography.Link style={{ fontSize: '16px' }}>
            <Flex align="center" gap={0.5}>
              Trade DexyGold
              <OpenIcon />
            </Flex>
          </Typography.Link>
        </Flex.Item>

        <Flex.Item>
          <Typography.Link style={{ fontSize: '16px' }}>
            <Flex align="center" gap={0.5}>
              Provide Liquiduty
              <OpenIcon />
            </Flex>
          </Typography.Link>
        </Flex.Item>
      </Flex.Item>
    </Box>
  );
};

export default TradeInfo;
