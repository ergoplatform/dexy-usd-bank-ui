import { Box, Typography } from '@ergolabs/ui-kit';
import React from 'react';
import styled from 'styled-components';

const DisclaimerWrapper = styled(Box)`
  .dark & {
    background: #111d2c;
    border-color: #15395b;
  }

  .light & {
    background: #e6f7ff;
    border-color: #91d5ff;
  }

  a {
    color: var(--spectrum-primary-color);

    &:hover {
      color: var(--spectrum-primary-color-hover);
    }

    &:active,
    &:focus {
      color: var(--spectrum-primary-color-active);
    }
  }
`;

export const Disclaimer: React.FC = () => {
  return (
    <DisclaimerWrapper padding={[2, 4]} borderRadius="l">
      <Typography.Body size="small">
        By connecting a wallet, you agree to the Cookie policy and acknowledge
        that you have read and understand the Protocol disclaimer.
      </Typography.Body>
    </DisclaimerWrapper>
  );
};
