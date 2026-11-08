import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';
import {ChartKind} from './chart-kinds';
import {Period} from '../Market';
import {desk} from './desk';

export const useDesk = () => {
  const {charts = 'price', updateSearchParams} = useSearchParamsObject({charts: schema.string});
  const seats = desk.dealt(charts);
  return {
    seats,
    absentKinds: desk.absent(seats),
    periodOf: (kind: ChartKind): Period =>
      maybe(seats.find(seat => seat.kind === kind)).map(({period}) => period).orElse(Period.hour),
    choosePeriod: (kind: ChartKind, period: Period) =>
      updateSearchParams({charts: desk.periodChosen(kind, period, seats)}),
    add: (kind: ChartKind) => updateSearchParams({charts: desk.added(kind, seats)}),
    remove: (at: number) => updateSearchParams({charts: desk.without(at, seats)}),
    reorder: (from: number, to: number, options?: {replace?: boolean}) =>
      updateSearchParams({charts: desk.seated(from, to, seats)}, options)
  };
};
