import { Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

export interface CommitmentTitleProps {
  children?: ReactNode | ReactNode[] | string;
  content?: string;
}

export const FormTitle: FC<CommitmentTitleProps> = ({ children, content }) => (
  <>
    {content ? (
      <InfoTooltip secondary content={content} width={256}>
        <Typography.Title level={4}>{children}</Typography.Title>
      </InfoTooltip>
    ) : (
      <Typography.Title level={4}>{children}</Typography.Title>
    )}
  </>
);
