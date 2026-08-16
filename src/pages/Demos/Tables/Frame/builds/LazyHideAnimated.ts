import {animatedColumnArrows, animatedRowArrows} from '@components/DragSortableTable/travel';
import {stand, veiled} from '../table';
import {animatedArranged, animatedOrdered, animatedSettleColumn, animatedSettleRow, shiftsRuled} from './settles';
import {lazyColumnFlight, lazyRowFlight} from './flights';

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: lazyColumnFlight(animatedSettleColumn),
      row: lazyRowFlight(animatedSettleRow)
    },
    arrows: {
      column: (mounted, held) => animatedColumnArrows(held, () => mounted.state().order, animatedOrdered(mounted)),
      row: (mounted, held) => animatedRowArrows(held, () => mounted.state().order, () => mounted.state().seated, animatedArranged(mounted, held))
    },
    veils: veiled,
    ruled: shiftsRuled,
  });
