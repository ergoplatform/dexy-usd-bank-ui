import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Form,
  Menu,
  Typography,
} from '@ergolabs/ui-kit';
import React from 'react';
import { Observable, of } from 'rxjs';
import styled from 'styled-components';

import { AssetInfo } from '../../../models/AssetInfo';
import { AssetTitle } from '../../AssetTitle/AssetTitle';

interface TokenSelectProps {
  readonly value?: AssetInfo | undefined;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
  readonly loading?: boolean;
}

const StyledDownOutlined = styled(DownOutlined)`
  font-size: 1rem;
`;

const StyledButton = styled.div`
  padding: calc(var(--spectrum-base-gutter) * 3);
  width: 100%;
`;

const AssetSelect: React.FC<TokenSelectProps> = ({
  value,
  disabled,
  readonly,
  loading,
}) => {
  return (
    <>
      {loading ? (
        <Button type="default" loading size="middle">
          Loading...
        </Button>
      ) : (
        <StyledButton>
          <Flex align="center">
            <Flex.Item flex={1} align="flex-start" display="flex">
              {value ? <AssetTitle level={3} gap={1} asset={value} /> : '...'}
            </Flex.Item>
          </Flex>
        </StyledButton>
      )}
    </>
  );
};

interface TokeSelectFormItem extends TokenSelectProps {
  name: string;
}

const AssetSelectFormItem: React.FC<TokeSelectFormItem> = ({
  name,
  ...rest
}) => {
  return (
    <Form.Item name={name}>
      {(params) => <AssetSelect {...{ ...rest, ...params }} />}
    </Form.Item>
  );
};

export { AssetSelect, AssetSelectFormItem };
