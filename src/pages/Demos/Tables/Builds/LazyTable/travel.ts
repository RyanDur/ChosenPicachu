import {ColumnDrag, Moving, RowDrag, survey, travel} from '@components/DragSortableTable/model';
import {has} from '@ryandur/sand';

export const travelledColumn = (order: readonly string[], moving: Moving) => (drag: ColumnDrag): string | undefined =>
  travel.lazy(survey.columnUnder(order, drag.survey))(drag.held, moving, drag.landing);

export const travelledRow = (standing: readonly string[], moving: Moving) => (drag: RowDrag): string | undefined =>
  travel.lazy(survey.rowUnder(standing, drag.survey))(drag.held, moving, drag.landing);

export const releasedColumn = (drag: ColumnDrag, beside: (neighbour: string) => void): void => {
  if (has(drag.landing)) {
    beside(drag.landing);
  }
};

export const releasedRow = (drag: RowDrag, beside: (neighbour: string) => void): void => {
  if (has(drag.landing)) {
    beside(drag.landing);
  }
};
