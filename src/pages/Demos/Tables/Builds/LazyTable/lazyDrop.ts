import {ColumnDrag, Moving, RowDrag, survey, travel} from '@components/DragSortableTable/model';
import {has} from '@ryandur/sand';

const column = (order: readonly string[], moving: Moving) => (drag: ColumnDrag): string | undefined =>
  travel.lazy(survey.columnUnder(order, drag.survey))(drag.held, moving, drag.landing);

const row = (standing: readonly string[], moving: Moving) => (drag: RowDrag): string | undefined =>
  travel.lazy(survey.rowUnder(standing, drag.survey))(drag.held, moving, drag.landing);

const released = (drag: ColumnDrag | RowDrag, beside: (neighbor: string) => void): void => {
  if (has(drag.landing)) {
    beside(drag.landing);
  }
};

export const lazyDrop = {column, row, released};
