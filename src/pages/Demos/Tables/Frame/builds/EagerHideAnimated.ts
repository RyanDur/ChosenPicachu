import {animatedColumnArrows, animatedRowArrows} from '@components/DragSortableTable/travel';
import {mount, veiled} from '../table';
import {animatedArranged, animatedOrdered, animatedSettleColumn, animatedSettleRow, shiftsRuled} from './settles';
import {eagerColumnFlight, eagerRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: eagerColumnFlight(animatedSettleColumn),
      row: eagerRowFlight(animatedSettleRow)
    },
    arrows: {
      column: (mounted, held) => animatedColumnArrows(held, () => mounted.state().order, animatedOrdered(mounted)),
      row: (mounted, held) => animatedRowArrows(held, () => mounted.state().order, () => mounted.state().seated, animatedArranged(mounted, held))
    },
    veils: veiled,
    ruled: shiftsRuled,
  });
