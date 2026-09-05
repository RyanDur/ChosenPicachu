import {columnArrows, rowArrows} from '@components/DragSortableTable/travel';
import {mount, veiled} from '../table';
import {arranged, glided, ordered, settleColumn, settleRow} from './settles';
import {eagerColumnFlight, eagerRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: eagerColumnFlight(settleColumn(glided)),
      row: eagerRowFlight(settleRow(glided))
    },
    arrows: {
      column: (mounted, held) => columnArrows(held, () => mounted.state().order, ordered(glided)(mounted)),
      row: (mounted, held) => rowArrows(held, () => mounted.state().seated, arranged(glided)(mounted, held))
    },
    settle: glided,
    veils: veiled,
  });
