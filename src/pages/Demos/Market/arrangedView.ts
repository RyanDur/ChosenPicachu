import {maybe} from '@ryandur/sand';
import {Arrangement, TableColumn, arrangements} from '@components/DragSortableTable/model';
import {Measured, Measures, cells} from './cells';

type ArrangedView = {
  columnsOf: (arrangement: Arrangement) => readonly TableColumn<Measured>[];
  rowsOf: (arrangement: Arrangement, aggregates: readonly Measures[]) => readonly Measures[];
};

export const arrangedView: ArrangedView = {
  columnsOf: arrangement => arrangement.columns.map(name => ({
    name,
    data: {label: name},
    ...maybe(arrangement.sort).mBind(sort => maybe(sort, ({column}) => column === name))
      .map(({direction}) => ({sorted: direction})).orElse({})
  })),
  rowsOf: (arrangement, aggregates) => {
    const shown = cells.seated(aggregates);
    const valueOf = (row: string, column: string) => maybe(shown.find(({key}) => key === row))
      .mBind(seated => maybe(seated.values[column]));
    const byLookback: ReadonlyMap<string, Measures> = new Map(aggregates.map(row => [row.lookback.key, row]));
    return arrangements.standingOf(arrangement, valueOf).flatMap(key => {
      const row = byLookback.get(key);
      return row ? [row] : [];
    });
  }
};
