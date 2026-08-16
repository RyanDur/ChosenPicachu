import {staticColumnArrows, staticRowArrows} from '@components/DragSortableTable/travel';
import {mount} from '../table';
import {staticArranged, staticOrdered, staticSettleColumn, staticSettleRow} from './settles';
import {lazyColumnFlight, lazyRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: lazyColumnFlight(staticSettleColumn),
      row: lazyRowFlight(staticSettleRow)
    },
    arrows: {
      column: (mounted, held) => staticColumnArrows(held, () => mounted.state().order, staticOrdered(mounted)),
      row: (mounted, held) => staticRowArrows(held, () => mounted.state().seated, staticArranged(mounted, held))
    },
  });
