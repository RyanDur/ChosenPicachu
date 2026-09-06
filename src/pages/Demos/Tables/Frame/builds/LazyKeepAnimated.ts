import {columnArrows, rowArrows} from '@components/DragSortableTable/travel';
import {mount} from '../table';
import {arranged, glided, ordered, settleColumn, settleRow} from './settles';
import {lazyColumnFlight, lazyRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: lazyColumnFlight(settleColumn),
      row: lazyRowFlight(settleRow)
    },
    arrows: {
      column: (mounted, held) => columnArrows(held, () => mounted.state().order, ordered(mounted)),
      row: (mounted, held) => rowArrows(held, mounted.standing, arranged(mounted, held))
    },
    show: glided,
  });
