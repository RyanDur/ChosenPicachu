import {Grab, Moving, RowNudge, Carry} from '@components/DragSortableTable/model';
import {MountedTable} from './table-state';

export type TableContext = MountedTable & {
  readonly lifted: (carry: Carry, grab: Grab) => void;
  readonly moved: (moving: Moving) => void;
  readonly dropped: () => void;
  readonly rowNudged: (row: string, nudge: RowNudge) => void;
  readonly rowMoved: (row: string, to: number) => void;
};
