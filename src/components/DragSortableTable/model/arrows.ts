import {maybe} from '@ryandur/sand';
import {PixelSizes, survey} from './survey';

type ArrowKey = {
  key: string;
  preventDefault: () => void;
  currentTarget: EventTarget | null;
};

type ArrowListener = (event: ArrowKey) => void;
type ColumnNudge = {from: number; to: number; widths: PixelSizes};
export type RowNudge = {from: number; to: number; heights: PixelSizes};
type RowMoves = {nudged: (nudge: RowNudge) => void; moved: (nudge: RowNudge) => void};

type Steps = Readonly<Record<string, 1 | -1>>;

type Arrows = {
  columnSteps: Steps;
  rowSteps: Steps;
  column: (held: string, order: () => readonly string[], arrange: (nudge: ColumnNudge) => void) => ArrowListener;
  row: (held: string, standing: () => readonly string[], moves: RowMoves) => ArrowListener;
};

const columnSteps: Steps = {ArrowRight: 1, ArrowLeft: -1};

const rowSteps: Steps = {ArrowDown: 1, ArrowUp: -1};

const column: Arrows['column'] = (held, order, arrange) => event => {
  maybe(columnSteps[event.key]).map(toward => {
    event.preventDefault();
    const columns = order();
    if (survey.anchored(columns.indexOf(held), columns.length)) {
      return;
    }
    const {from, to} = survey.nudgedColumn(columns, held, toward);
    const table = event.currentTarget instanceof Element ? event.currentTarget.closest('table') : null;
    if (to !== from) {
      arrange({from, to, widths: maybe(table).map(held => survey.bounded(held, columns).columnWidths).orElse({})});
    }
  });
};

const row: Arrows['row'] = (held, standing, {nudged, moved}) => event => {
  maybe(rowSteps[event.key]).map(toward => {
    event.preventDefault();
    const seats = standing();
    const {from, to} = survey.nudgedRow(seats, held, toward);
    const table = event.currentTarget instanceof Element ? event.currentTarget.closest('table') : null;
    const nudge = {from, to, heights: maybe(table).map(held => survey.rowHeights(held, seats)).orElse({})};
    nudged(nudge);
    if (to !== from) {
      moved(nudge);
    }
  });
};

export const arrows: Arrows = {columnSteps, rowSteps, column, row};
