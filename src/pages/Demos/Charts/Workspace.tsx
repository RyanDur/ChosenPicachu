import {FC, KeyboardEvent, ReactNode} from 'react';
import * as D from 'schemawax';
import {Link} from 'react-router';
import {Menu} from '@components/Menu';
import {useSearchParamsObject} from '@components/search-params';
import Handle from '@components/grip.svg';
import {Paths} from '@pages/Paths';
import {Trade} from './coinbase';
import {allChartKinds, ChartKind, isChartKind} from './kinds';
import {LiveTradesState, statusCopy} from './useLiveTrades';
import {useChartTravel} from './useChartTravel';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import './Workspace.css';

const chartNames: Record<ChartKind, string> = {
  price: 'Price line',
  candles: 'Candles',
  pressure: 'Pressure',
  pie: 'Pie'
};

type ChartCard = FC<{trades: readonly Trade[]; id?: string; actions?: ReactNode}>;

const chartCards: Record<ChartKind, ChartCard> = {
  price: PriceChart,
  candles: Candles,
  pressure: Pressure,
  pie: Pie
};

const doorways: Record<ChartKind, Paths> = {
  price: Paths.priceChartTutorial,
  candles: Paths.candlesChartTutorial,
  pressure: Paths.pressureChartTutorial,
  pie: Paths.pieChartTutorial
};

type Props = {
  trades: readonly Trade[];
  status: LiveTradesState['status'];
  product: string;
};

export const Workspace: FC<Props> = ({trades, status, product}) => {
  const {charts = 'price', updateSearchParams} = useSearchParamsObject({charts: D.string});
  const dealtCharts = charts.split(',').filter(isChartKind)
    .filter((kind, at, all) => all.indexOf(kind) === at);
  const chartKinds: readonly ChartKind[] = dealtCharts.length > 0 ? dealtCharts : ['price'];
  const addChart = (kind: ChartKind) => () =>
    updateSearchParams({charts: [kind, ...chartKinds].join(',')});
  const absentKinds = allChartKinds.filter(kind => !chartKinds.includes(kind));
  const removeChart = (at: number) => () =>
    updateSearchParams({charts: chartKinds.filter((_, seat) => seat !== at).join(',')});
  const seated = (from: number, to: number): ChartKind[] => {
    const next = [...chartKinds];
    const [lifted] = next.splice(from, 1);
    next.splice(to, 0, lifted);
    return next;
  };
  const {armed, setArmed, dress, theater, lift, travel, release, settled} =
    useChartTravel(chartKinds.length, (from, to) =>
      updateSearchParams({charts: seated(from, to).join(',')}, {replace: true}));
  const grip = (at: number) =>
    chartKinds.length > 1
      ? <button type="button" className="chart-grip" aria-label="move chart" tabIndex={-1}
                onMouseDown={() => setArmed(at)}>
        <Handle/>
      </button>
      : undefined;
  const dismissal = (at: number) =>
    chartKinds.length > 1
      ? <button type="button" className="remove-chart" aria-label="remove chart" tabIndex={-1}
                onClick={removeChart(at)}>×</button>
      : undefined;
  const keys = (at: number) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const to = Math.min(Math.max(at + (event.key === 'ArrowDown' ? 1 : -1), 0), chartKinds.length - 1);
      if (to !== at) {
        updateSearchParams({charts: seated(at, to).join(',')});
        const slot = event.currentTarget.closest('.chart-list')?.querySelectorAll(':scope > .chart-slot').item(to);
        const next = slot?.querySelector('.doorway');
        if (next instanceof HTMLElement) {
          next.focus();
        }
      }
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && chartKinds.length > 1) {
      event.preventDefault();
      removeChart(at)();
    }
  };
  return <>
    <header className="charts-heading">
      <h2 className="headline">{`Bitcoin, live — every ${product} trade on Coinbase`}</h2>
      <output className="status" data-status={status}>{statusCopy[status]}</output>
      {absentKinds.length > 0 &&
        <Menu id="add-chart" label="Add a chart" toggle="+"
              toggleClassName="add-chart button secondary">
          {absentKinds.map(kind =>
            <button type="button" key={kind} className="item"
                    onClick={addChart(kind)}>{chartNames[kind]}</button>)}
        </Menu>}
    </header>
    <ul className="chart-list">{chartKinds.map((kind, at) => {
      const Chart = chartCards[kind];
      return <li key={at}
                 className={dress(at)} style={theater(at)}
                 onAnimationEnd={settled}
                 draggable={armed === at}
                 onDragStart={lift(at)}
                 onDragOver={travel}
                 onDrop={event => event.preventDefault()}
                 onDragEnd={release}>
        <Link className="doorway" to={doorways[kind]}
              aria-label={`chart ${at + 1}`} onKeyDown={keys(at)}/>
        {grip(at)}
        <Chart id={`chart-${at}`} trades={trades} actions={dismissal(at)}/>
      </li>;
    })}
    </ul>
  </>;
};
