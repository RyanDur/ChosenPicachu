import {FC, FocusEvent, PointerEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import './Table.css';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useTableDispatch, useTableSelector} from './context';
import {neighbourOfColumn, selectOrder, selectWidths, widthOfColumn} from './selectors';
import {awoken, tradedBy} from './actions';
import {Grip, grippedAt, measuredWidths, resizeArrows, resizeLabel, soughtTrade, traded} from '@components/Table/shares';

export const ResizeHandle: FC<{column: string}> = ({column}) => {
  const dispatch = useTableDispatch();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const neighbour = useTableSelector(neighbourOfColumn(column));
  const widths = useTableSelector(selectWidths);
  const width = useTableSelector(widthOfColumn(column));
  const [grip, setGrip] = useState<Maybe<Grip>>(nothing());
  const [carried, setCarried] = useState(0);

  const awaken = (table: HTMLTableElement): void =>
    dispatch(awoken(measuredWidths(order, table)));
  const trade = (delta: number): void => {
    dispatch(tradedBy(column, neighbour, delta));
    maybe(widths).map(current =>
      setLanded({axis: 'share', name: column, share: traded(column, neighbour, delta)(current)[column]}));
  };

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
          setGrip(maybe(grippedAt(table.getBoundingClientRect().width, event.clientX)));
          setCarried(0);
        });
      }}
      onPointerMove={(event: PointerEvent<HTMLElement>) =>
        grip.map(held => {
          const sought = soughtTrade(held, event.clientX, carried);
          trade(sought.delta);
          setCarried(sought.carried);
        })}
      onPointerUp={() => setGrip(nothing())}/>
    <MoveReport landed={landed}/>
  </>;
};
