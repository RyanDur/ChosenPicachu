import {animatedColumnArrows, animatedRowArrows} from '@components/DragSortableTable/travel';
import {stand} from '../table';
import {animatedArranged, animatedOrdered, animatedSettleColumn, animatedSettleRow, shiftsRuled} from './settles';
import {eagerColumnFlight, eagerRowFlight} from './flights';

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: eagerColumnFlight(animatedSettleColumn),
      row: eagerRowFlight(animatedSettleRow)
    },
    arrows: {
      column: (mounted, held) => animatedColumnArrows(held, () => mounted.state().order, animatedOrdered(mounted)),
      row: (mounted, held) => animatedRowArrows(held, () => mounted.state().order, () => mounted.state().seated, animatedArranged(mounted, held))
    },
    ruled: shiftsRuled,
  });
