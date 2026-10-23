import {maybe, not} from '@ryandur/sand';
import {STEP_SHARE, grippedAt, measuredFloors, measuredWidths, neighborOf} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {TableAction} from '@components/DragSortableTable/actions';
import {arrowLifted, columnOfHeader, gripped, handleDragged, handleLeft, handleReleased, measured, MountedTable, pointerHolds, tradedBy, widthsOf} from './table-state';
import {contextOf} from './context';
import {listen, nothingToUndo, Undo, undoingAll} from './undo';

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

const resizing = (host: HTMLElement, column: string, handle: HTMLElement): Undo => undoingAll([
  listen(handle, 'focus', () => contextOf(host).map(awaken)),
  listen(handle, 'pointerdown', event => {
    event.stopPropagation();
    contextOf(host).map(context => {
      awaken(context);
      maybe(grippedAt(context.table.getBoundingClientRect().width, event.clientX)).map(grip => saidAfter(context, gripped(column, grip)));
    });
    handle.setPointerCapture(event.pointerId);
  }),
  listen(handle, 'pointermove', event => contextOf(host).map(({store, order}) => not(pointerHolds(store.state, column))
    ? undefined
    : store.dispatch(handleDragged(column, neighborOf(order(), column), event.clientX)))),
  ...(['pointerup', 'pointercancel', 'lostpointercapture'] as const).map(landing =>
    listen(handle, landing, () => contextOf(host).map(context => saidAfter(context, handleReleased(column))))),
  listen(handle, 'keyup', event => maybe(columnSteps[event.key]).map(() =>
    contextOf(host).map(context => saidAfter(context, arrowLifted(column))))),
  listen(handle, 'blur', () => contextOf(host).map(context => saidAfter(context, handleLeft(column)))),
  listen(handle, 'keydown', event => maybe(columnSteps[event.key]).map(toward => {
    event.preventDefault();
    event.stopPropagation();
    contextOf(host).map(context => {
      awaken(context);
      saidAfter(context, tradedBy(column, neighborOf(context.order(), column), toward * STEP_SHARE));
    });
  }))
]);

export const resizeHandle = (host: HTMLElement): Undo =>
  maybe(host.querySelector('button')).mBind(handle =>
    maybe(host.closest('th')).map(th => resizing(host, columnOfHeader(th), handle))).orElse(nothingToUndo);
