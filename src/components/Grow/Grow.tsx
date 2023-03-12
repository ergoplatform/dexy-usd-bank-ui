import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as Prism } from './prism.svg';

export interface GlowProps {
  readonly className?: string;
}

const _Glow: FC<GlowProps> = ({ className }) => (
  <div className={className}>
    <Prism />
  </div>
);

export const Glow = styled(_Glow)`
  top: 2.25rem;
  left: 1rem;
  right: 1rem;
  position: fixed;
  width: calc(100% - 2rem);
  display: flex;
  justify-content: center;
  overflow: hidden;
  z-index: -1;

  svg {
    max-width: 840px;
  }
`;
