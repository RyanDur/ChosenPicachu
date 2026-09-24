import {maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {anchored, bounded, columnSteps, nudgedColumn, nudgedRow, rowHeights, rowSteps} from './survey';

type ArrowKey = {
  key: string;
  preventDefault: () => void;
  currentTarget: EventTarget | null;
};

export const columnArrows = (
  held: string,
  order: () => readonly string[],
  arrange: (nudge: {from: number; to: number; widths: Readonly<Record<string, number>>}) => void
) => (event: ArrowKey): void => {
  maybe(columnSteps[event.key]).map(toward => {
    event.preventDefault();
    const columns = order();
    if (anchored(columns.indexOf(held), columns.length)) {
      return;
    }
    const {from, to} = nudgedColumn(columns, held, toward);
    const table = event.currentTarget instanceof Element ? event.currentTarget.closest('table') : null;
    if (to !== from) {
      arrange({from, to, widths: table === null ? {} : bounded(table, columns).columnWidths});
    }
  });
};

export const rowArrows = (
  held: string,
  standing: () => readonly string[],
  arrange: (nudge: {from: number; to: number; after: string[]; heights: Readonly<Record<string, number>>}) => void
) => (event: ArrowKey): void => {
  maybe(rowSteps[event.key]).map(toward => {
    event.preventDefault();
    const seats = standing();
    const {from, to} = nudgedRow(seats, held, toward);
    const table = event.currentTarget instanceof Element ? event.currentTarget.closest('table') : null;
    arrange({from, to, after: array.moveToIndex(to, held, seats), heights: table === null ? {} : rowHeights(table, seats)});
  });
};
