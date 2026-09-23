import {FC, FocusEvent, PointerEvent, useState} from 'react';
import {maybe} from '@ryandur/sand';
import './Table.css';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useTableDispatch, useTableSelector} from './context';
import {columnGripped, neighbourOfColumn, resizeCarried, selectOrder, selectWidths, widthOfColumn} from './selectors';
import {awoken, gripped, handleDragged, released, tradedBy} from './actions';
import {grippedAt, measuredWidths, resizeArrows, resizeLabel, traded} from '@components/Table/shares';

export const ResizeHandle: FC<{column: string}> = ({column}) => {
  const dispatch = useTableDispatch();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const neighbour = useTableSelector(neighbourOfColumn(column));
  const widths = useTableSelector(selectWidths);
  const width = useTableSelector(widthOfColumn(column));
  const held = useTableSelector(columnGripped(column));
  const moved = useTableSelector(resizeCarried(column));
  const resized = (share: number): Landed => ({axis: 'share', name: column, share});

  const awaken = (table: HTMLTableElement): void =>
    dispatch(awoken(measuredWidths(order, table)));
  const trade = (delta: number): void => {
    dispatch(tradedBy(column, neighbour, delta));
    maybe(widths).map(current => setLanded(resized(traded(column, neighbour, delta)(current)[column])));
  };
  const release = (): void => {
    if (moved) {
      maybe(width).map(share => setLanded(resized(share)));
    }
    dispatch(released());
  };
  const followed = (event: PointerEvent<HTMLElement>): void =>
    dispatch(handleDragged(neighbour, event.clientX));

  return <>
    <button type="button"
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
      onLostPointerCapture={held ? release : undefined}/>
    <MoveReport landed={moved ? maybe(width).map(resized).orElse(landed) : landed}/>
  </>;
};
