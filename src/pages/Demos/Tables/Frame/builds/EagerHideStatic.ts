import {staticColumnArrows, staticRowArrows} from '@components/DragSortableTable/travel';
import {stand, veiled} from '../table';
import {staticArranged, staticOrdered, staticSettleColumn, staticSettleRow} from './settles';
import {eagerColumnFlight, eagerRowFlight} from './flights';

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: eagerColumnFlight(staticSettleColumn),
      row: eagerRowFlight(staticSettleRow)
    },
    arrows: {
      column: (mounted, held) => staticColumnArrows(held, () => mounted.state().order, staticOrdered(mounted)),
      row: (mounted, held) => staticRowArrows(held, () => mounted.state().seated, staticArranged(mounted, held))
    },
    veils: veiled,
  });
