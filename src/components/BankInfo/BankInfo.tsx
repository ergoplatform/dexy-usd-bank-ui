import { RustModule } from '@ergolabs/ergo-sdk';
import { Box, Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Mint } from 'dexy-sdk-ts';
import React from 'react';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as OpenIcon } from '../../assets/OpeninNew.svg';
import { ergAsset } from '../../common/assets/ergAsset';
import { Currency } from '../../common/models/Currency';
import { useGoldLp } from '../../hooks/useGoldLp';
import { useGoldOracle } from '../../hooks/useGoldOracle';

const BankInfo = () => {
  const { valBySize } = useDevice();

  const [oracle] = useGoldOracle();
  const [lpBox] = useGoldLp();

  if (!oracle || !lpBox) {
    return null;
  }

  const mint = new Mint(
    RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(oracle)),
    RustModule.SigmaRust.ErgoBox.from_json(JSON.stringify(lpBox)),
  );

  return (
    <Box borderRadius={'xl'} padding={4}>
      <Flex.Item justify="space-between" marginBottom={valBySize(1, 2)}>
        <Typography.Link
          style={{ fontSize: valBySize('12px', '14px', '16px') }}
          href={applicationConfig.dexyOraclePool}
          target="_blank"
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
            1 DexyGOLD ={' '}
            {new Currency(
              mint.getMintObject().oracleRate(),
              ergAsset,
            ).toString()}{' '}
            ERG
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
            1 DexyGOLD ={' '}
            {new Currency(mint.getMintObject().lpRate(), ergAsset).toString()}{' '}
            ERG
          </Typography.Body>
        </div>
      </Flex.Item>
    </Box>
  );
};

export default BankInfo;
