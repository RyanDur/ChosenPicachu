import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@components/search-params';
import {ChartKind} from './kinds';
import {Period} from './period';
import {absent, added, dealt, periodChosen, seated, without} from './desk';

export const useDesk = () => {
  const {charts = 'price', updateSearchParams} = useSearchParamsObject({charts: schema.string});
  const seats = dealt(charts);
  return {
    seats,
    absentKinds: absent(seats),
    periodOf: (kind: ChartKind): Period => maybe(seats.find(seat => seat.kind === kind)).map(({period}) => period).orElse(Period.hour),
    choosePeriod: (kind: ChartKind, period: Period) => updateSearchParams({charts: periodChosen(kind, period, seats)}),
    add: (kind: ChartKind) => updateSearchParams({charts: added(kind, seats)}),
    remove: (at: number) => updateSearchParams({charts: without(at, seats)}),
    reorder: (from: number, to: number, options?: {replace?: boolean}) =>
      updateSearchParams({charts: seated(from, to, seats)}, options)
  };
};
