import {FC, FocusEvent, KeyboardEvent, PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';

const STEP_SHARE = 2;

type Grip = {
    fromX: number;
    pxPerShare: number;
} | null;

type Props = {
    column: string;
    share?: number;
    onAwaken: (table: HTMLTableElement) => void;
    onTrade: (delta: number) => void;
};

export const ResizeHandle: FC<Props> = ({column, share, onAwaken, onTrade}) => {
    const [grip, setGrip] = useState<Grip>(null);
    const [traded, setTraded] = useState(0);

    return <button type="button"
              className="resize-handle"
              aria-label={has(share)
                  ? `resize ${column}, ${Math.round(share)}%`
                  : `resize ${column}`}
              onFocus={(event: FocusEvent<HTMLElement>) => {
                  const table = event.currentTarget.closest('table');
                  if (table !== null) {
                      onAwaken(table);
                  }
              }}
              onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
                      return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  onTrade(event.key === 'ArrowRight' ? STEP_SHARE : -STEP_SHARE);
              }}
              onMouseDown={event => event.stopPropagation()}
              onPointerDown={(event: PointerEvent<HTMLElement>) => {
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                  const table = event.currentTarget.closest('table');
                  if (table !== null) {
                      onAwaken(table);
                  }
                  const surface = table?.getBoundingClientRect().width ?? 0;
                  setGrip({fromX: event.clientX, pxPerShare: surface / 100});
                  setTraded(0);
              }}
              onPointerMove={(event: PointerEvent<HTMLElement>) => {
                  if (grip === null || grip.pxPerShare === 0) {
                      return;
                  }
                  const sought = (event.clientX - grip.fromX) / grip.pxPerShare;
                  onTrade(sought - traded);
                  setTraded(sought);
              }}
              onPointerUp={() => setGrip(null)}/>;
};
