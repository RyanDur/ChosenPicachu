import * as schema from 'schemawax';
import {useSearchParamsObject} from '@components/search-params';
import {ChartKind} from './kinds';
import {absent, added, dealt, seated, without} from './desk';

export const useDesk = () => {
  const {charts = 'price', updateSearchParams} = useSearchParamsObject({charts: schema.string});
  const chartKinds = dealt(charts);
  return {
    chartKinds,
    absentKinds: absent(chartKinds),
    add: (kind: ChartKind) => updateSearchParams({charts: added(kind, chartKinds)}),
    remove: (at: number) => updateSearchParams({charts: without(at, chartKinds)}),
    reorder: (from: number, to: number, options?: {replace?: boolean}) =>
      updateSearchParams({charts: seated(from, to, chartKinds)}, options)
  };
};
