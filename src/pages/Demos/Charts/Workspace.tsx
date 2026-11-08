import {Entry, Item, Menu} from '@components/Menu';
import {FC, useState} from 'react';
import {generatePath, Link} from 'react-router';
import {maybe, Maybe} from '@ryandur/sand';
import {Paths} from '@navigation';
import {ChartKind, matchChartKind} from './kinds';
import {lampOf, statusCopy} from './live-trades';
import {classNames} from '@components';
import {marketSelectors} from '../Market';
import {useMarketSelector} from '../Market/Trading';
import {useDesk} from './useDesk';
import {atAfterRemoval} from './desk';
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

const doorway = (kind: ChartKind): string => generatePath(Paths.chartTutorial, {kind});

const doorwayAt = (at: number, pressed: Element): Maybe<HTMLElement> =>
  maybe(pressed.closest('li'))
    .mBind(removed => maybe(removed.parentElement?.children[at]))
    .mBind(neighbor => maybe(neighbor.querySelector<HTMLElement>(':scope > [data-doorway]')));

type Props = {
  product: string;
};

export const Workspace: FC<Props> = ({product}) => {
  const trades = useMarketSelector(marketSelectors.liveTrades);
  const status = useMarketSelector(marketSelectors.feedStatus);
  const {seats, absentKinds, add, remove, reorder, choosePeriod} = useDesk();
  const [report, setReport] = useState('');
  const nameAt = (at: number): string => chartNames[seats[at].kind];
  const removed = (at: number, pressed: Element): void => {
    atAfterRemoval(at, seats.length).mBind(next => doorwayAt(next, pressed)).map(link => link.focus());
    remove(at);
    setReport(`${nameAt(at)} removed`);
  };
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
      <h2 className="headline title bold ink">{`Bitcoin, live: every ${product} trade on Coinbase`}</h2>
      <output className={classNames('status', 'muted-ink', 'tracked', lampOf[status])} aria-label="feed">{statusCopy[status]}</output>
      <output className="off-screen" aria-label="desk report">{report}</output>
      {absentKinds.length > 0 &&
          <>
            <button type="button" className="add-chart rounded-corners button secondary circular round-glyph"
              popoverTarget="add-chart"
              aria-label="Add a chart">+
            </button>
            <Menu id="add-chart" tabIndex={-1} popover="auto" className="card rounded-corners lifted"
              aria-label="charts to add">
              {absentKinds.map(kind =>
                <Entry key={kind}>
                  <Item className="sub-title"
                    popoverTarget="add-chart" popoverTargetAction="hide"
                    onClick={() => {
                      add(kind);
                      setReport(`${chartNames[kind]} added`);
                    }}>{chartNames[kind]}</Item>
                </Entry>)}
            </Menu>
          </>}
    </header>
    <ol className="chart-list" aria-label="charts">{seats.map(({kind, period}, at) => {
      const actions = plural ? <Dismissal onRemoved={pressed => removed(at, pressed)}/> : undefined;
      return <li key={kind}
        className={dress(at)}
        onAnimationEnd={settled}
        draggable={isArmed(at)}
        onDragStart={lift(at)}
        onDragOver={travel}
        onDrop={event => event.preventDefault()}
        onDragEnd={release}>
        <Link className="doorway focal" data-doorway to={doorway(kind)} onKeyDown={keys(at)}>
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
  </>;
};
