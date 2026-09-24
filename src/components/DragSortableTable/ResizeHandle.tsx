import {FC, FocusEvent, PointerEvent} from 'react';
import {maybe} from '@ryandur/sand';
import './Table.css';
import {useTableDispatch, useTableSelector} from './context';
import {columnGripped, neighbourOfColumn, selectOrder, widthOfColumn} from './selectors';
import {awoken, gripped, handleDragged, released, tradedBy} from './actions';
import {grippedAt, measuredWidths, resizeArrows, resizeLabel} from '@components/Table/shares';

export const ResizeHandle: FC<{column: string}> = ({column}) => {
  const dispatch = useTableDispatch();
  const order = useTableSelector(selectOrder);
  const neighbour = useTableSelector(neighbourOfColumn(column));
  const width = useTableSelector(widthOfColumn(column));
  const held = useTableSelector(columnGripped(column));

  const awaken = (table: HTMLTableElement): void =>
    dispatch(awoken(measuredWidths(order, table)));
  const trade = (delta: number): void => dispatch(tradedBy(column, neighbour, delta));
  const release = (): void => dispatch(released());
  const followed = (event: PointerEvent<HTMLElement>): void =>
    dispatch(handleDragged(neighbour, event.clientX));

  return <button type="button"
    tabIndex={0}
    className="resize-handle"
    aria-label={resizeLabel(column, width)}
    onFocus={(event: FocusEvent<HTMLElement>) =>
      maybe(event.currentTarget.closest('table')).map(awaken)}
    onKeyDown={resizeArrows(trade)}
    onMouseDown={event => event.stopPropagation()}
    onPointerDown={(event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      maybe(event.currentTarget.closest('table')).map(table => {
        awaken(table);
        maybe(grippedAt(table.getBoundingClientRect().width, event.clientX)).map(grip => dispatch(gripped(column, grip)));
      });
    }}
    onPointerMove={held ? followed : undefined}
    onPointerUp={held ? release : undefined}
    onPointerCancel={held ? release : undefined}
    onLostPointerCapture={held ? release : undefined}/>;
};
