import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { LeftPanel } from './LeftPanel/LeftPanel';
import { RightPanel } from './RightPanel/RightPanel';

const HeaderContainer = styled.header`
  height: 80px;
`;

export const Header: FC = () => {
  return (
    <HeaderContainer>
      <Flex align="center" stretch justify="space-between">
        <LeftPanel />
        <RightPanel />
      </Flex>
    </HeaderContainer>
  );
};
