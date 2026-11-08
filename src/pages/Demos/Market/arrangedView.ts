import {Arrangement, standingOf} from '@components/DragSortableTable/arrangement';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {Measured, Measures, seated} from './cells';

type ArrangedView = {
  columnsOf: (arrangement: Arrangement) => readonly TableColumn<Measured>[];
  rowsOf: (arrangement: Arrangement, aggregates: readonly Measures[]) => readonly Measures[];
};

export const arrangedView: ArrangedView = {
  columnsOf: arrangement => arrangement.columns.map(name => ({
    name,
    data: {label: name},
    sorted: arrangement.sort?.column === name ? arrangement.sort.direction : undefined
  })),
  rowsOf: (arrangement, aggregates) => {
    const shown = seated(aggregates);
    const valueOf = (row: string, column: string) => shown.find(({key}) => key === row)?.values[column];
    const byWindow = new Map(aggregates.map(row => [row.window.display, row]));
    return standingOf(arrangement, valueOf).flatMap(key => {
      const row = byWindow.get(key);
      return row ? [row] : [];
    });
  }
};
