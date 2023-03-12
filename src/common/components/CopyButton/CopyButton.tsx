import { Button, message, Tooltip } from '@ergolabs/ui-kit';
import React, { ReactNode } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIcon } from './icon-copy.svg';

interface CopyButtonProps {
  text: string;
  children?: ReactNode | string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        message.success(`Address successfully copied`);
      }}
    >
      <Tooltip title={`Copy Address to clipboard.`} trigger="hover">
        <Button
          size="small"
          onClick={(e) => e.stopPropagation()}
          icon={<CopyIcon />}
          style={{ lineHeight: '24px' }}
        />
      </Tooltip>
    </CopyToClipboard>
  );
};

export { CopyButton };
