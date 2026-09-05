import {columnArrows, rowArrows} from '@components/DragSortableTable/travel';
import {mount, veiled} from '../table';
import {arranged, cut, ordered, settleColumn, settleRow} from './settles';
import {lazyColumnFlight, lazyRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: lazyColumnFlight(settleColumn(cut)),
      row: lazyRowFlight(settleRow(cut))
    },
    arrows: {
      column: (mounted, held) => columnArrows(held, () => mounted.state().order, ordered(cut)(mounted)),
      row: (mounted, held) => rowArrows(held, () => mounted.state().seated, arranged(cut)(mounted, held))
    },
    settle: cut,
    veils: veiled,
  });
