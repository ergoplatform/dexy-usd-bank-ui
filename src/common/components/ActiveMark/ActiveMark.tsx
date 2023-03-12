import React from 'react';
import styled, { css } from 'styled-components';

export const ActiveMark = styled.div<{ active: boolean }>`
  background: var(--spectrum-disabled-color);
  border-radius: 50%;
  border: 1px solid var(--spectrum-box-bg);
  height: 8px;
  width: 8px;

  ${(props) =>
    props.active &&
    css`
      background: var(--spectrum-success-color);
    `}
`;
