import {FC, FocusEvent, PointerEvent} from 'react';
import {maybe} from '@ryandur/sand';
import {useHydrated} from '../useHydrated';
import './Table.css';
import {useTableDispatch} from './useTableDispatch';
import {useTableSelector} from './useTableSelector';
import {tableActions, tableSelectors} from './model';
import {
  shares
} from '../shares';

export const ResizeHandle: FC<{column: string}> = ({column}) => {
  const dispatch = useTableDispatch();
  const order = useTableSelector(tableSelectors.order);
  const neighbour = useTableSelector(tableSelectors.neighbourOfColumn(column));
  const namedShare = useTableSelector(tableSelectors.namedShareOfColumn(column));
  const held = useTableSelector(tableSelectors.columnGripped(column));
  const hydrated = useHydrated();

  const awaken = (table: HTMLTableElement): void =>
    dispatch(tableActions.awoken(shares.measuredWidths(order, table), shares.measuredFloors(order, table)));
  const trade = (delta: number): void => dispatch(tableActions.tradedBy(column, neighbour, delta));
  const release = (): void => dispatch(tableActions.handleReleased(column));
  const followed = (event: PointerEvent<HTMLElement>): void =>
    dispatch(tableActions.handleDragged(column, neighbour, event.clientX));

  return <button type="button"
    tabIndex={0}
    disabled={!hydrated}
    className="resize-handle borderless unfilled held-bar-after focus-ringed"
    aria-label={shares.resizeLabel(column, namedShare)}
    onFocus={(event: FocusEvent<HTMLElement>) =>
      maybe(event.currentTarget.closest('table')).map(awaken)}
    onKeyDown={shares.resizeArrows(trade)}
    onKeyUp={shares.resizeArrowLifted(() => dispatch(tableActions.arrowLifted(column)))}
    onBlur={() => dispatch(tableActions.handleLeft(column))}
    onMouseDown={event => event.stopPropagation()}
    onPointerDown={(event: PointerEvent<HTMLElement>) => {
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      maybe(event.currentTarget.closest('table')).map(table => {
        awaken(table);
        maybe(shares.grippedAt(table.getBoundingClientRect().width, event.clientX))
          .map(grip => dispatch(tableActions.gripped(column, grip)));
      });
    }}
    onPointerMove={held ? followed : undefined}
    onPointerUp={held ? release : undefined}
    onPointerCancel={held ? release : undefined}
    onLostPointerCapture={held ? release : undefined}/>;
};
