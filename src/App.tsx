import {
  Col,
  ContextModalProvider,
  Flex,
  Row,
  useDevice,
} from '@ergolabs/ui-kit';
import { DateTime, Interval } from 'luxon';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { useObservable } from './common/hooks/useObservable';
import { ergoWasm$ } from './common/services/ergoWasm';
import { startAppTicks } from './common/streams/appTick';
import { device } from './common/utils/size';
import BankInfo from './components/BankInfo/BankInfo';
import { BankReservesGraph } from './components/BankReservesGraph/BankReservesGraph';
import { CirculationSupply } from './components/CirculationSupply/CirculationSupply';
import { Glow } from './components/Grow/Grow';
import { Header } from './components/Header/Header';
import { MintForm } from './components/MintForm/MintForm';
import TradeInfo from './components/TradeInfo/TradeInfo';

const Container = styled(Flex)`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  width: 100%;

  ${device.m} {
    padding: 0 1.5rem;
  }

  ${device.l} {
    padding: 0 2rem;
  }
`;

const Content = styled(Flex)`
  width: 100%;
  max-width: 1156px;
  margin: 0 auto;
`;

export const App: FC = () => {
  const [applicationReady] = useObservable(ergoWasm$);
  const { valBySize } = useDevice();

  useEffect(() => {
    if (applicationReady) {
      startAppTicks();
    }
  }, [applicationReady]);

  return (
    <>
      {applicationReady && (
        <ContextModalProvider>
          <Container col>
            <Glow />
            <Flex.Item>
              <Header />
            </Flex.Item>

            <Flex.Item
              marginTop={valBySize(5, 5, 20)}
              style={{ paddingBottom: '100px' }}
            >
              <Content col={valBySize(true, true, false)}>
                <Col
                  span={valBySize(24, 24, 12)}
                  style={{
                    paddingRight: valBySize('0', '0', '16px'),
                    paddingBottom: valBySize('16px', '16px', '0'),
                  }}
                >
                  <Flex col>
                    <Flex.Item marginBottom={4}>
                      <BankInfo />
                    </Flex.Item>
                    <Flex.Item marginBottom={4}>
                      <MintForm />
                    </Flex.Item>
                    <Flex.Item>
                      <TradeInfo />
                    </Flex.Item>
                  </Flex>
                </Col>
                <Col span={valBySize(24, 24, 12)}>
                  <Content gap={4} col>
                    <BankReservesGraph />
                    <CirculationSupply />
                  </Content>
                </Col>
              </Content>
            </Flex.Item>
          </Container>
        </ContextModalProvider>
      )}
    </>
  );
};
