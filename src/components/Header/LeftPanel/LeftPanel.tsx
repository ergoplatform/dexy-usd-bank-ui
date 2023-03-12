import {
  Button,
  Flex,
  Logo,
  Menu,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';

export const LeftPanel: FC = () => {
  const { moreThan, valBySize } = useDevice();

  return (
    <Flex align="center" gap={valBySize(8, 8)}>
      <Typography.Title>Logotype</Typography.Title>
    </Flex>
  );
};
