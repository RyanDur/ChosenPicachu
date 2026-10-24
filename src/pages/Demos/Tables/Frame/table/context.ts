import {Grab} from '@components/DragSortableTable/lift';
import {Moving} from '@components/DragSortableTable/travel';
import {RowNudge} from '@components/DragSortableTable/arrows';
import {Carry, MountedTable} from './table-state';

export type TableContext = MountedTable & {
  readonly lifted: (carry: Carry, grab: Grab) => void;
  readonly moved: (moving: Moving) => void;
  readonly dropped: () => void;
  readonly rowNudged: (row: string, nudge: RowNudge) => void;
  readonly rowMoved: (row: string, to: number) => void;
};
