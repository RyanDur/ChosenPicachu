import {Maybe, nothing, some} from '@ryandur/sand';
import {ChartTravelChange} from './chart-travel-change';

type Pushed = Readonly<Record<number, 'up' | 'down'>>;

export type ChartTravelState = {
  readonly armed: Maybe<number>;
  readonly aloft: Maybe<number>;
  readonly mark: number;
  readonly pushed: Pushed;
};

const initial: ChartTravelState = {armed: nothing(), aloft: nothing(), mark: 0, pushed: {}};

const reduce = (travel: ChartTravelState, change: ChartTravelChange): ChartTravelState => {
  switch (change.type) {
    case 'armed': return {...travel, armed: some(change.at)};
    case 'disarmed': return {...travel, armed: nothing()};
    case 'lifted': return {...travel, mark: change.pointer, aloft: some(change.at)};
    case 'swapped': return {
      ...travel,
      mark: change.pointer,
      pushed: {[change.held]: change.to > change.held ? 'up' : 'down'},
      aloft: some(change.to)
    };
    case 'released': return {...travel, aloft: nothing(), armed: nothing()};
    case 'settled': return {...travel, pushed: {}};
  }
};

type ChartTravelModule = {
  initial: ChartTravelState;
  reduce: (travel: ChartTravelState, change: ChartTravelChange) => ChartTravelState;
};

export const chartTravel: ChartTravelModule = {initial, reduce};
