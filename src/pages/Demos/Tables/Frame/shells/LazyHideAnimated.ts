import {animatedColumnArrows, animatedRowArrows} from '@components/DragSortableTable/travel';
import {stand, veiled} from '../shell';
import {animatedArranged, animatedOrdered, animatedSettleColumn, animatedSettleRow, shiftsRuled} from './settles';
import {lazyColumnFlight, lazyRowFlight} from './flights';

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: lazyColumnFlight(animatedSettleColumn),
      row: lazyRowFlight(animatedSettleRow)
    },
    arrows: {
      column: (shell, held) => animatedColumnArrows(held, () => shell.desk().order, animatedOrdered(shell)),
      row: (shell, held) => animatedRowArrows(held, () => shell.desk().order, () => shell.desk().seated, animatedArranged(shell, held))
    },
    veils: veiled,
    ruled: shiftsRuled,
  });
