import {animatedColumnArrows, animatedRowArrows} from '@components/DragSortableTable/travel';
import {mount} from '../table';
import {animatedArranged, animatedOrdered, animatedSettleColumn, animatedSettleRow, shiftsRuled} from './settles';
import {lazyColumnFlight, lazyRowFlight} from '@components/DragSortableTable/flights';

export const wire = (document: Document): void =>
  mount(document, {
    flights: {
      column: lazyColumnFlight(animatedSettleColumn),
      row: lazyRowFlight(animatedSettleRow)
    },
    arrows: {
      column: (mounted, held) => animatedColumnArrows(held, () => mounted.state().order, animatedOrdered(mounted)),
      row: (mounted, held) => animatedRowArrows(held, () => mounted.state().order, () => mounted.state().seated, animatedArranged(mounted, held))
    },
    ruled: shiftsRuled,
  });
