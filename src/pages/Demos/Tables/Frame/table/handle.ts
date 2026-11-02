import {maybe, not} from '@ryandur/sand';
import {STEP_SHARE, grippedAt, measuredFloors, measuredWidths, neighborOf} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {TableAction} from '@components/DragSortableTable/actions';
import {arrowLifted, columnOfHeader, gripped, handleDragged, handleLeft, handleReleased, measured, MountedTable, pointerHolds, tradedBy, widthsOf} from './table-state';

type Resizing = Pick<MountedTable, 'table' | 'store' | 'order' | 'report'>;

const saidAfter = ({store, report}: Pick<MountedTable, 'store' | 'report'>, happened: TableAction): void => {
  const said = store.state.report;
  store.dispatch(happened);
  maybe(store.state.report).map(now => now === said ? undefined : report(now));
};

const awaken = ({table, store, order}: Resizing): void => {
  const widths = widthsOf(store.state) ?? measuredWidths(order(), table);
  store.dispatch(measured(widths, measuredFloors(order(), table)));
};

const resizing = (context: Resizing, column: string, handle: HTMLElement): void => {
  handle.addEventListener('focus', () => awaken(context));
  handle.addEventListener('pointerdown', event => {
    event.stopPropagation();
    awaken(context);
    maybe(grippedAt(context.table.getBoundingClientRect().width, event.clientX)).map(grip => saidAfter(context, gripped(column, grip)));
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => not(pointerHolds(context.store.state, column))
    ? undefined
    : context.store.dispatch(handleDragged(column, neighborOf(context.order(), column), event.clientX)));
  (['pointerup', 'pointercancel', 'lostpointercapture'] as const).forEach(landing =>
    handle.addEventListener(landing, () => saidAfter(context, handleReleased(column))));
  handle.addEventListener('keyup', event => maybe(columnSteps[event.key]).map(() => saidAfter(context, arrowLifted(column))));
  handle.addEventListener('blur', () => saidAfter(context, handleLeft(column)));
  handle.addEventListener('keydown', event => maybe(columnSteps[event.key]).map(toward => {
    event.preventDefault();
    event.stopPropagation();
    awaken(context);
    saidAfter(context, tradedBy(column, neighborOf(context.order(), column), toward * STEP_SHARE));
  }));
};

export const resizeHandle = (context: Resizing, handle: HTMLElement): void => {
  maybe(handle.closest('th')).map(th => resizing(context, columnOfHeader(th), handle));
};
