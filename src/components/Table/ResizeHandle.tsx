import {FC, FocusEvent, KeyboardEvent, PointerEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Grip, STEP_SHARE, grippedAt, resizeLabel, soughtTrade} from './shares';

const steps: Record<string, number> = {ArrowRight: STEP_SHARE, ArrowLeft: -STEP_SHARE};

type Props = {
    column: string;
    share?: number;
    onAwaken: (table: HTMLTableElement) => void;
    onTrade: (delta: number) => void;
};

export const ResizeHandle: FC<Props> = ({column, share, onAwaken, onTrade}) => {
    const [grip, setGrip] = useState<Maybe<Grip>>(nothing());
    const [traded, setTraded] = useState(0);

    return <button type="button"
              className="resize-handle"
              aria-label={resizeLabel(column, share)}
              onFocus={(event: FocusEvent<HTMLElement>) =>
                  maybe(event.currentTarget.closest('table')).map(onAwaken)}
              onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
                  maybe(steps[event.key]).map(step => {
                      event.preventDefault();
                      event.stopPropagation();
                      onTrade(step);
                  })}
              onMouseDown={event => event.stopPropagation()}
              onPointerDown={(event: PointerEvent<HTMLElement>) => {
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  maybe(event.currentTarget.closest('table')).map(table => {
                      onAwaken(table);
                      setGrip(maybe(grippedAt(table.getBoundingClientRect().width, event.clientX)));
                      setTraded(0);
                  });
              }}
              onPointerMove={(event: PointerEvent<HTMLElement>) =>
                  grip.map(held => {
                      const trade = soughtTrade(held, event.clientX, traded);
                      onTrade(trade.delta);
                      setTraded(trade.carried);
                  })}
              onPointerUp={() => setGrip(nothing())}/>;
};
