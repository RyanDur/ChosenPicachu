import {FC, useEffect, useState} from 'react';
import {generatePath, Link} from 'react-router';
import {Maybe, nothing, some} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {ChartKind, matchChartKind} from './kinds';
import {statusCopy} from './live-trades';
import {classNames} from '@components/class-names';
import {useDemosSelector} from '../Provider';
import {selectFeedStatus, selectLiveTrades} from '../store';
import {useDesk} from './useDesk';
import {seatAfterRemoval} from './desk';
import {useChartTravel} from './useChartTravel';
import {Grip} from './Grip';
import {Dismissal} from './Dismissal';
import {PriceChart} from './PriceChart';
import {Candles} from './Candles';
import {Pressure} from './Pressure';
import {Pie} from './Pie';
import './Workspace.css';
import {ChartHeading} from './heading';

const chartNames: Record<ChartKind, string> = {
  price: 'Price line',
  candles: 'Candles',
  pressure: 'Pressure',
  pie: 'Pie'
};

const doorway = (kind: ChartKind): string => generatePath(Paths.chartTutorial, {kind});

const doorwayId = (kind: ChartKind): string => `doorway-${kind}`;

type Props = {
  product: string;
};

export const Workspace: FC<Props> = ({product}) => {
  const trades = useDemosSelector(selectLiveTrades);
  const status = useDemosSelector(selectFeedStatus);
  const {seats, absentKinds, add, remove, reorder, choosePeriod} = useDesk();
  const [report, setReport] = useState('');
  const [removal, setRemoval] = useState<Maybe<{at: number; stood: number}>>(nothing());
  const nameAt = (at: number): string => chartNames[seats[at].kind];
  const removed = (at: number): void => {
    remove(at);
    setReport(`${nameAt(at)} removed`);
    setRemoval(some({at, stood: seats.length}));
  };
  useEffect(() => {
    removal.map(({at, stood}) => {
      if (seats.length < stood) {
        seatAfterRemoval(at, seats).map(seat => document.getElementById(doorwayId(seat.kind))?.focus());
        setRemoval(nothing());
      }
    });
  }, [removal, seats]);
  const {isArmed, arm, disarm, dress, lift, travel, release, keys, settled} =
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
      <h3 className="headline">{`Bitcoin, live — every ${product} trade on Coinbase`}</h3>
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
    <ChartHeading.Provider value="h4">
      <ol className="chart-list" aria-label="charts">{seats.map(({kind, period}, at) => {
        const actions = plural ? <Dismissal onRemoved={() => removed(at)}/> : undefined;
        return <li key={kind}
          className={dress(at)}
          onAnimationEnd={settled}
          draggable={isArmed(at)}
          onDragStart={lift(at)}
          onDragOver={travel}
          onDrop={event => event.preventDefault()}
          onDragEnd={release}>
          <Link id={doorwayId(kind)} className="doorway" to={doorway(kind)} onKeyDown={keys(at)}>
            <span className="off-screen">{`${chartNames[kind]} tutorial`}</span>
          </Link>
          {plural && <Grip onPressed={() => arm(at)} onReleased={disarm}/>}
          {matchChartKind(kind, {
            price: () => <PriceChart id={`chart-${kind}`} trades={trades} actions={actions}
              period={period} onPeriodChosen={chosen => choosePeriod('price', chosen)}/>,
            candles: () => <Candles id={`chart-${kind}`} trades={trades} actions={actions}
              period={period} onPeriodChosen={chosen => choosePeriod('candles', chosen)}/>,
            pressure: () => <Pressure trades={trades} actions={actions}/>,
            pie: () => <Pie trades={trades} actions={actions}/>
          }).orNull()}
        </li>;
      })}
      </ol>
    </ChartHeading.Provider>
  </>;
};
