import {Maybe, maybe} from '@ryandur/sand';
import {Grab} from '@components/DragSortableTable/lift';
import {Moving} from '@components/DragSortableTable/travel';
import {RowNudge} from '@components/DragSortableTable/arrows';
import {Carry, MountedTable} from './table-state';

export type TableContext = MountedTable & {
  readonly lift: (carry: Carry, grab: Grab) => void;
  readonly moved: (moving: Moving) => void;
  readonly drop: () => void;
  readonly rowNudged: (row: string, nudge: RowNudge) => void;
  readonly rowTo: (row: string, to: number) => void;
};

const provided = new WeakMap<Element, () => Maybe<TableContext>>();

export const provide = (table: Element, context: () => Maybe<TableContext>): void => {
  provided.set(table, context);
};

export const contextOf = (part: Element): Maybe<TableContext> =>
  maybe(part.closest('drag-sortable-table')).mBind(table => maybe(provided.get(table)).mBind(context => context()));
