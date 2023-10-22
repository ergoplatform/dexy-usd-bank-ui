import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Box,
  Button,
  Empty,
  Flex,
  IconProvider,
  LoadingOutlined,
  Spin,
  Tabs,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import sortedUniqBy from 'lodash/sortedUniqBy';
import { DateTime } from 'luxon';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';

import { dexyGoldAsset } from '../../common/assets/dexyGoldAsset';
import { ergAsset } from '../../common/assets/ergAsset';
import { DateTimeView } from '../../common/components/DateTimeView/DateTimeView';
import { Truncate } from '../../common/components/Truncate/Truncate';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { PoolChartData } from '../../common/models/PoolChartData';
import { bankReservesGraph } from '../../mockData/chart';
import { useAggregatedByDateData } from './useAggregatedByDateData';
import { useChartData } from './useChartData';
import { Period, usePeriodSettings } from './usePeriodSettings';
import { useTicks } from './useTicks';

interface AbsoluteContainerProps {
  className?: string;
  children?: ReactNode;
}

const _AbsoluteContainer: React.FC<AbsoluteContainerProps> = ({
  className,
  children,
}) => (
  <Flex
    position="absolute"
    col
    justify="center"
    className={className}
    align="center"
  >
    {children}
  </Flex>
);

const AbsoluteContainer = styled(_AbsoluteContainer)`
  top: 60px;
  border-radius: 8px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export const CirculationSupply: React.FC = () => {
  const [defaultActivePeriod, setDefaultActivePeriod] = useState<Period>('D');
  const { s, valBySize } = useDevice();
  const { durationOffset, timeFormat, tick } =
    usePeriodSettings(defaultActivePeriod);

  const ticks = useTicks(tick, durationOffset, [defaultActivePeriod]);
  const params = useMemo(
    () => ({
      start: DateTime.now().minus(durationOffset).valueOf(),
      end: DateTime.now().valueOf(),
    }),
    [durationOffset],
  );
  const [getChartData] = useChartData(params);
  const rawData = getChartData?.map((value) => new PoolChartData(value)) ?? [];

  const data = useAggregatedByDateData(rawData, ticks);

  // recharts couldn't animate when dataKey is changed
  const chartData = useMemo(() => [...data], [data]);

  const [activeData, setActiveData] = useState<PoolChartData | null>();

  const bankReserveValue = new Currency(393423n, dexyGoldAsset);

  const isEmpty = data.length === 0;

  const formatXAxis = useCallback(
    (ts: number | string) => {
      if (typeof ts === 'string') {
        return ts;
      }
      return DateTime.fromMillis(ts).toLocaleString(timeFormat);
    },
    [defaultActivePeriod],
  );

  const dataKey = 'reservesCount';

  const active = activeData ?? data[data.length - 1];
  const loading = false;

  const displayedTicks = useMemo(
    () =>
      sortedUniqBy(
        ticks.filter((a) => a.valueOf() > data[0]?.ts),
        (a) => a.toLocaleString(timeFormat),
      ).map((a) => a.valueOf()),
    [data, ticks, timeFormat],
  );
  const tabs = (
    <Tabs
      defaultActiveKey={defaultActivePeriod}
      onChange={(key) => setDefaultActivePeriod(key)}
    >
      <Tabs.TabPane tab="D" key="D" />
      <Tabs.TabPane tab="W" key="W" />
      <Tabs.TabPane tab="M" key="M" />
      <Tabs.TabPane tab="Y" key="Y" />
    </Tabs>
  );

  return (
    <Box borderRadius={'xl'}>
      <Flex col position="relative">
        <Flex.Item marginTop={4} marginLeft={4} marginRight={4}>
          <Flex align="center">
            <Typography.Text>Circulation Supply</Typography.Text>
            {!s && <Flex.Item marginLeft="auto">{tabs}</Flex.Item>}
          </Flex>
        </Flex.Item>
        {active && !isEmpty && (
          <Flex.Item
            marginTop={valBySize(2, 0)}
            position="absolute"
            style={{ top: 0, left: 0 }}
          >
            <Flex align="flex-end">
              <Flex.Item marginLeft={4} marginRight={2}>
                <Typography.Title level={valBySize(4, 2)}>
                  {active.reservesCount.toString()}
                </Typography.Title>
              </Flex.Item>
              <Flex.Item marginBottom={0.5} marginRight={2}>
                <Typography.Title level={valBySize(5, 4)}>
                  {bankReserveValue.asset.ticker}
                </Typography.Title>
              </Flex.Item>
            </Flex>
            <Flex.Item
              marginLeft={valBySize(4, 6)}
              marginBottom={valBySize(1, 0)}
              marginTop={valBySize(1, 0)}
            >
              <Typography.Text
                style={{
                  fontSize: valBySize('12px', '14px'),
                }}
                type="secondary"
              >
                <DateTimeView type="datetimeWithWeekday" value={active.date} />
              </Typography.Text>
            </Flex.Item>
          </Flex.Item>
        )}
        {s && (
          <Flex.Item
            marginLeft={4}
            marginRight={4}
            marginBottom={2}
            marginTop={2}
          >
            {tabs}
          </Flex.Item>
        )}
        <Flex.Item
          marginTop={!active || isEmpty ? 14 : 0}
          marginLeft={4}
          marginRight={4}
          position="relative"
          style={{
            position: 'relative',
            height: 320,
          }}
        >
          <ChartWrapper>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                reverseStackOrder
                onMouseMove={(state: any) => {
                  setActiveData(state?.activePayload?.[0]?.payload);
                }}
                syncMethod="index"
                onMouseLeave={() => setActiveData(null)}
                style={{
                  visibility: isEmpty || loading ? 'hidden' : 'visible',
                }}
              >
                <YAxis
                  dataKey={dataKey}
                  type="number"
                  domain={['auto', 'auto']}
                />
                <XAxis
                  dataKey="ts"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  ticks={displayedTicks}
                  tickFormatter={formatXAxis}
                />
                <defs>
                  <linearGradient
                    id="gradientColor"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      stopColor="var(--spectrum-primary-color-hover)"
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="1"
                      stopColor="var(--spectrum-primary-color-hover)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <Tooltip wrapperStyle={{ display: 'none' }} />
                <Area
                  dataKey={dataKey}
                  stroke="var(--spectrum-primary-color-hover)"
                  fill="url(#gradientColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Flex.Item>
        {isEmpty && !loading && (
          <AbsoluteContainer>
            <Empty>
              <Typography.Text>Not enough data</Typography.Text>
            </Empty>
          </AbsoluteContainer>
        )}
        {loading && (
          <AbsoluteContainer>
            <Spin indicator={<LoadingOutlined />} size="large" />
            <Typography style={{ fontSize: '16px' }}>Loading</Typography>
          </AbsoluteContainer>
        )}
      </Flex>
    </Box>
  );
};
