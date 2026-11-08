import {Grab, Moving, RowNudge} from '@components/DragSortableTable/model';
import {Carry, MountedTable} from './table-state';

export type TableContext = MountedTable & {
  readonly lifted: (carry: Carry, grab: Grab) => void;
  readonly moved: (moving: Moving) => void;
  readonly dropped: () => void;
  readonly rowNudged: (row: string, nudge: RowNudge) => void;
  readonly rowMoved: (row: string, to: number) => void;
};
