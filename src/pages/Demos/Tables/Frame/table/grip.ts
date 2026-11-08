import {maybe} from '@ryandur/sand';
import {arrows, lifting} from '@components/DragSortableTable/model';
import {TableContext} from './context';
import {carrying} from './carry';
import {rowOf} from './rows';

const gripping = (context: TableContext, grip: HTMLElement, held: string): void => {
  const {order, standing, lifted, rowNudged, rowMoved} = context;
  grip.addEventListener('pointerdown', lifting.row(order, standing, grab => lifted({axis: 'row', held}, grab)));
  carrying(grip, context);
  grip.addEventListener('keydown', arrows.row(held, standing, {nudged: nudge => rowNudged(held, nudge), moved: ({to}) => rowMoved(held, to)}));
};

export const rowGrip = (context: TableContext, grip: HTMLElement): void => {
  maybe(grip.closest('tr')).map(lane => gripping(context, grip, rowOf(lane)));
};
