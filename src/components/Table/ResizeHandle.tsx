import {FC, KeyboardEvent, PointerEvent, useState} from 'react';

const STEP_SHARE = 2;

export const SLIMMEST = 5;

type Grip = {
    fromX: number;
    pxPerShare: number;
} | null;

type Props = {
    column: string;
    share: number;
    onTrade: (delta: number) => void;
};

export const ResizeHandle: FC<Props> = ({column, share, onTrade}) => {
    const [grip, setGrip] = useState<Grip>(null);
    const [traded, setTraded] = useState(0);

    return <i role="separator"
              tabIndex={0}
              className="resize-handle"
              aria-orientation="vertical"
              aria-label={`resize ${column}`}
              aria-valuenow={Math.round(share)}
              aria-valuemin={SLIMMEST}
              aria-valuemax={100 - SLIMMEST}
              onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
                      return;
                  }
                  event.preventDefault();
                  onTrade(event.key === 'ArrowRight' ? STEP_SHARE : -STEP_SHARE);
              }}
              onMouseDown={event => event.stopPropagation()}
              onPointerDown={(event: PointerEvent<HTMLElement>) => {
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                  const surface = event.currentTarget.closest('table')?.getBoundingClientRect().width ?? 0;
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
