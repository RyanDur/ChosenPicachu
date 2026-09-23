import {FC, useEffect, useState} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {ChartKind, matchChartKind} from './kinds';
import {statusCopy} from './live-trades';
import {classNames} from '@components/class-names';
import {useDemosSelector} from '../Provider';
import {selectFeedStatus, selectLiveTrades} from '../store';
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

const doorwayId = (kind: ChartKind): string => `doorway-${kind}`;

type Props = {
  product: string;
};

export const Workspace: FC<Props> = ({product}) => {
  const trades = useDemosSelector(selectLiveTrades);
  const status = useDemosSelector(selectFeedStatus);
  const {seats, absentKinds, add, remove, reorder, choosePeriod} = useDesk();
  const [report, setReport] = useState('');
  const [placing, setPlacing] = useState<{at: number; from: number}>();
  const nameAt = (at: number): string => chartNames[seats[at].kind];
  const removed = (at: number): void => {
    remove(at);
    setReport(`${nameAt(at)} removed`);
    setPlacing({at, from: seats.length});
  };
  useEffect(() => {
    maybe(placing).map(({at, from}) => {
      if (seats.length < from) {
        maybe(seats[Math.min(at, seats.length - 1)]).map(seat => document.getElementById(doorwayId(seat.kind))?.focus());
        setPlacing(undefined);
      }
    });
  }, [placing, seats]);
  const {isArmed, arm, dress, lift, travel, release, keys, settled} =
    useChartTravel({
      seats: seats.length,
      onSeated: (from, to, options) => {
        reorder(from, to, options);
        setReport(`${nameAt(from)} moved to ${to + 1} of ${seats.length}`);
      },
      onRemoved: removed
    });
  const plural = seats.length > 1;

  return <>
    <header className="charts-heading">
      <h2 className="headline">{`Bitcoin, live — every ${product} trade on Coinbase`}</h2>
      <output className={classNames('status', status)} aria-label="feed">{statusCopy[status]}</output>
      <output className="off-screen" aria-label="desk report">{report}</output>
      {absentKinds.length > 0 &&
          <>
            <button type="button" className="menu-toggle rounded-corners add-chart button secondary"
              popoverTarget="add-chart"
              aria-label="Add a chart">+
            </button>
            <menu id="add-chart" tabIndex={-1} popover="auto" className="menu card rounded-corners lifted"
              aria-label="charts to add">
              {absentKinds.map(kind =>
                <li className="entry" key={kind}>
                  <button type="button" className="item sub-title"
                    popoverTarget="add-chart" popoverTargetAction="hide"
                    onClick={() => {
                      add(kind);
                      setReport(`${chartNames[kind]} added`);
                    }}>{chartNames[kind]}</button>
                </li>)}
            </menu>
          </>}
    </header>
    <ol className="chart-list" aria-label="charts">{seats.map(({kind, period}, at) => {
      const actions = plural ? <Dismissal onRemove={() => removed(at)}/> : undefined;
      return <li key={kind}
        className={dress(at)}
        onAnimationEnd={settled}
        draggable={isArmed(at)}
        onDragStart={lift(at)}
        onDragOver={travel}
        onDrop={event => event.preventDefault()}
        onDragEnd={release}>
        <Link id={doorwayId(kind)} className="doorway" to={doorways[kind]} onKeyDown={keys(at)}>
          <span className="off-screen">{`${chartNames[kind]} tutorial`}</span>
        </Link>
        {plural && <Grip onArm={() => arm(at)}/>}
        {matchChartKind(kind, {
          price: () => <PriceChart id={`chart-${at}`} trades={trades} actions={actions}
            period={period} onPeriod={chosen => choosePeriod('price', chosen)}/>,
          candles: () => <Candles id={`chart-${at}`} trades={trades} actions={actions}
            period={period} onPeriod={chosen => choosePeriod('candles', chosen)}/>,
          pressure: () => <Pressure trades={trades} actions={actions}/>,
          pie: () => <Pie trades={trades} actions={actions}/>
        }).orNull()}
      </li>;
    })}
    </ol>
  </>;
};
