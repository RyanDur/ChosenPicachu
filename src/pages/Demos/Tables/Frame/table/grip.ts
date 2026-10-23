import {maybe} from '@ryandur/sand';
import {rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import {contextOf} from './context';
import {listen, nothingToUndo, Undo, undoingAll} from './undo';
import {carrying} from './carry';
import {rowOf} from './rows';

const gripping = (host: HTMLElement, grip: HTMLElement, held: string): Undo => undoingAll([
  listen(grip, 'pointerdown', event => contextOf(host).map(({order, standing, lift}) =>
    rowLift(order, standing, grab => lift({axis: 'row', held}, grab))(event))),
  carrying(grip, () => contextOf(host)),
  listen(grip, 'keydown', event => contextOf(host).map(({standing, rowNudged, rowTo}) =>
    rowArrows(held, standing, {nudged: nudge => rowNudged(held, nudge), moved: ({to}) => rowTo(held, to)})(event)))
]);

export const rowGrip = (host: HTMLElement): Undo =>
  maybe(host.querySelector('button')).mBind(grip =>
    maybe(host.closest('tr')).map(lane => gripping(host, grip, rowOf(lane)))).orElse(nothingToUndo);
