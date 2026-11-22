import {has, Maybe, maybe} from '@ryandur/sand';
import {Labeled, Seated} from '@components/DragSortableTable/model';
import {money} from './money';
import {Lookback, LookbackTotals, Traded} from './trade-totals';

const priceChange = (traded?: Traded): Measure =>
  has(traded) ? {display: money.deltaLabel(traded.opened, traded.closed), value: traded.closed - traded.opened} : {display: '—'};

const averaged = (traded?: Traded): Measure =>
  has(traded) ? {display: money.cents.format(traded.vwap), value: traded.vwap} : {display: '—'};

export type Measure = {
  display: string;
  value?: number;
  moved?: Moved;
};

export type Moved = 'up' | 'down';

const measureNames = ['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'] as const;

export type MeasureName = typeof measureNames[number];

const isMeasure = (name: string): name is MeasureName => measureNames.some(known => known === name);

export type LookbackMeasure = Measure & {key: Lookback};

export type Measures = Readonly<{lookback: LookbackMeasure} & Record<Exclude<MeasureName, 'lookback'>, Measure>>;

export type Measured = Labeled;

const measures: readonly {name: MeasureName; data: Measured}[] =
  measureNames.map(name => ({name, data: {label: name}}));

const seated = (rows: readonly Measures[]): readonly Seated[] =>
  rows.map(row => ({
    key: row.lookback.key,
    values: Object.fromEntries(measureNames.map(name => [name, row[name].value]))
  }));

const from = (aggregate: LookbackTotals): Measures => ({
  lookback: {display: aggregate.name, key: aggregate.lookback},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: averaged(aggregate.traded),
  change: priceChange(aggregate.traded)
});

const directionOf = (was: Measure, now: Measure): Maybe<Moved> =>
  maybe(was.value).mBind(old => maybe(now.value).map((value): Moved => value > old ? 'up' : 'down'));

const marked = (was: Measure, now: Measure): Measure =>
  now.display === was.display ? now : directionOf(was, now).map(direction => ({...now, moved: direction})).orElse(now);

const markedAgainst = (was: Measures, now: Measures): Measures => ({
  lookback: now.lookback,
  trades: marked(was.trades, now.trades),
  buys: marked(was.buys, now.buys),
  sells: marked(was.sells, now.sells),
  volume: marked(was.volume, now.volume),
  vwap: marked(was.vwap, now.vwap),
  change: marked(was.change, now.change)
});

type Cells = {
  measures: readonly {name: MeasureName; data: Measured}[];
  isMeasure: (name: string) => name is MeasureName;
  seated: (rows: readonly Measures[]) => readonly Seated[];
  from: (aggregate: LookbackTotals) => Measures;
  markedAgainst: (was: Measures, now: Measures) => Measures;
};

export const cells: Cells = {measures, isMeasure, seated, from, markedAgainst};
