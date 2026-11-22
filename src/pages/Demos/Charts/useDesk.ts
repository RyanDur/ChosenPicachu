import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';
import {ChartKind} from './chart-kinds';
import {Period} from '../Market';
import {desk} from './desk';
import {readerSettings} from '../ReaderSettings';

export const useDesk = () => {
  const {[readerSettings.deskParam]: charts = 'price', updateSearchParams} = useSearchParamsObject({[readerSettings.deskParam]: schema.string});
  const seats = desk.dealt(charts);
  return {
    seats,
    leftOut: desk.leftOut(charts),
    absentKinds: desk.absent(seats),
    periodOf: (kind: ChartKind): Period =>
      maybe(seats.find(seat => seat.kind === kind)).map(({period}) => period).orElse(Period.hour),
    choosePeriod: (kind: ChartKind, period: Period) =>
      updateSearchParams({[readerSettings.deskParam]: desk.periodChosen(kind, period, seats)}),
    add: (kind: ChartKind) => updateSearchParams({[readerSettings.deskParam]: desk.added(kind, seats)}),
    remove: (at: number) => updateSearchParams({[readerSettings.deskParam]: desk.without(at, seats)}),
    reorder: (from: number, to: number, options?: {replace?: boolean}) =>
      updateSearchParams({[readerSettings.deskParam]: desk.seated(from, to, seats)}, options)
  };
};
