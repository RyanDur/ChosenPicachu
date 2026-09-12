import {ColumnDrag, RowDrag} from '@components/DragSortableTable/table-state';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {Moving, lazyTravel} from '@components/DragSortableTable/travel';

export const travelledColumn = (order: readonly string[], moving: Moving) => (drag: ColumnDrag): string | undefined =>
  lazyTravel(columnUnder(order, drag.survey))(drag.held, moving, drag.landing);

export const travelledRow = (standing: readonly string[], moving: Moving) => (drag: RowDrag): string | undefined =>
  lazyTravel(rowUnder(standing, drag.survey))(drag.held, moving, drag.landing);

export const releasedColumn = (drag: ColumnDrag, beside: (neighbour: string) => void): void => {
  if (drag.landing !== undefined) {
    beside(drag.landing);
  }
};

export const releasedRow = (drag: RowDrag, beside: (neighbour: string) => void): void => {
  if (drag.landing !== undefined) {
    beside(drag.landing);
  }
};
