import {ColumnDrag, Moving, RowDrag, survey, travel} from '@components/DragSortableTable/model';
import {Maybe} from '@ryandur/sand';

const column = (order: readonly string[], moving: Moving) => (drag: ColumnDrag): Maybe<string> =>
  travel.lazy(survey.columnUnder(order, drag.survey))(drag.held, moving, drag.landing);

const row = (standing: readonly string[], moving: Moving) => (drag: RowDrag): Maybe<string> =>
  travel.lazy(survey.rowUnder(standing, drag.survey))(drag.held, moving, drag.landing);

const released = (drag: ColumnDrag | RowDrag, beside: (neighbor: string) => void): void => {
  drag.landing.map(beside);
};

export const lazyDrop = {column, row, released};
