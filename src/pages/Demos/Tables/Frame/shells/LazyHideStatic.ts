import {staticColumnArrows, staticRowArrows} from '@components/DragSortableTable/travel';
import {stand, veiled} from '../shell';
import {staticArranged, staticOrdered, staticSettleColumn, staticSettleRow} from './settles';
import {lazyColumnFlight, lazyRowFlight} from './flights';

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: lazyColumnFlight(staticSettleColumn),
      row: lazyRowFlight(staticSettleRow)
    },
    arrows: {
      column: (shell, held) => staticColumnArrows(held, () => shell.desk().order, staticOrdered(shell)),
      row: (shell, held) => staticRowArrows(held, () => shell.desk().seated, staticArranged(shell, held))
    },
    veils: veiled,
  });
