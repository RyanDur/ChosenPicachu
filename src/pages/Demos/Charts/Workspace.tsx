import {FC} from 'react';
import {Link} from 'react-router';
import {Menu} from '@components/Menu';
import {Paths} from '@pages/Paths';
import {Trade} from './coinbase';
import {ChartKind, matchChartKind} from './kinds';
import {LiveTradesState, statusCopy} from './useLiveTrades';
import {useDesk} from './useDesk';
import {useChartTravel} from './useChartTravel';
import {Grip} from './Grip';
import {Dismissal} from './Dismissal';
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
  const {chartKinds, absentKinds, add, remove, reorder} = useDesk();
  const {isArmed, arm, dress, lift, travel, release, keys, settled} =
    useChartTravel({seats: chartKinds.length, onSeated: reorder, onRemoved: remove});
  const plural = chartKinds.length > 1;

  return <>
    <header className="charts-heading">
      <h2 className="headline">{`Bitcoin, live — every ${product} trade on Coinbase`}</h2>
      <output className="status" data-status={status}>{statusCopy[status]}</output>
      {absentKinds.length > 0 &&
        <Menu id="add-chart" label="Add a chart" toggle="+"
              toggleClassName="add-chart button secondary">
          {absentKinds.map(kind =>
            <button type="button" key={kind} className="item sub-title"
                    popoverTarget="add-chart" popoverTargetAction="hide"
                    onClick={() => add(kind)}>{chartNames[kind]}</button>)}
        </Menu>}
    </header>
    <ul className="chart-list">{chartKinds.map((kind, at) => {
      const actions = plural ? <Dismissal onRemove={() => remove(at)}/> : undefined;
      return <li key={at}
                 className={dress(at)}
                 onAnimationEnd={settled}
                 draggable={isArmed(at)}
                 onDragStart={lift(at)}
                 onDragOver={travel}
                 onDrop={event => event.preventDefault()}
                 onDragEnd={release}>
        <Link className="doorway" to={doorways[kind]}
              aria-label={`chart ${at + 1}`} onKeyDown={keys(at)}/>
        {plural && <Grip onArm={() => arm(at)}/>}
        {matchChartKind(kind, {
          price: () => <PriceChart id={`chart-${at}`} trades={trades} actions={actions}/>,
          candles: () => <Candles id={`chart-${at}`} trades={trades} actions={actions}/>,
          pressure: () => <Pressure trades={trades} actions={actions}/>,
          pie: () => <Pie trades={trades} actions={actions}/>
        }).orNull()}
      </li>;
    })}
    </ul>
  </>;
};
