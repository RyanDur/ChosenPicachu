import {FC, FocusEvent, PointerEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {useColumn} from './column-context';
import {Grip, grippedAt, resizeArrows, resizeLabel, soughtTrade} from './shares';

export const ResizeHandle: FC = () => {
    const {name, share, onAwaken, onTrade} = useColumn();
    const [grip, setGrip] = useState<Maybe<Grip>>(nothing());
    const [traded, setTraded] = useState(0);

    return <button type="button"
              className="resize-handle"
              aria-label={resizeLabel(name, share)}
              onFocus={(event: FocusEvent<HTMLElement>) =>
                  maybe(event.currentTarget.closest('table')).map(onAwaken)}
              onKeyDown={resizeArrows(onTrade)}
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
