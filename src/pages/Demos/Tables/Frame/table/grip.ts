import {maybe} from '@ryandur/sand';
import {rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import {TableContext} from './context';
import {carrying} from './carry';
import {rowOf} from './rows';

const gripping = (context: TableContext, grip: HTMLElement, held: string): void => {
  const {order, standing, lifted, rowNudged, rowMoved} = context;
  grip.addEventListener('pointerdown', rowLift(order, standing, grab => lifted({axis: 'row', held}, grab)));
  carrying(grip, context);
  grip.addEventListener('keydown', rowArrows(held, standing, {nudged: nudge => rowNudged(held, nudge), moved: ({to}) => rowMoved(held, to)}));
};

export const rowGrip = (context: TableContext, grip: HTMLElement): void => {
  maybe(grip.closest('tr')).map(lane => gripping(context, grip, rowOf(lane)));
};
