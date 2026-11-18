import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';
import {ChartKind} from './chart-kinds';
import {Period} from '../Market';
import {desk} from './desk';
import {readerSettings} from '../ReaderSettings';

export const useDesk = () => {
  const {[readerSettings.desk]: charts = 'price', updateSearchParams} = useSearchParamsObject({[readerSettings.desk]: schema.string});
  const seats = desk.dealt(charts);
  return {
    seats,
    absentKinds: desk.absent(seats),
    periodOf: (kind: ChartKind): Period =>
      maybe(seats.find(seat => seat.kind === kind)).map(({period}) => period).orElse(Period.hour),
    choosePeriod: (kind: ChartKind, period: Period) =>
      updateSearchParams({[readerSettings.desk]: desk.periodChosen(kind, period, seats)}),
    add: (kind: ChartKind) => updateSearchParams({[readerSettings.desk]: desk.added(kind, seats)}),
    remove: (at: number) => updateSearchParams({[readerSettings.desk]: desk.without(at, seats)}),
    reorder: (from: number, to: number, options?: {replace?: boolean}) =>
      updateSearchParams({[readerSettings.desk]: desk.seated(from, to, seats)}, options)
  };
};
