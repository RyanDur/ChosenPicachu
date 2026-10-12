import {FC, PropsWithChildren, TransitionEvent, useLayoutEffect, useRef, useState} from 'react';
import {classNames} from '@components/class-names';

type Motion = {moving: false} | {moving: true; height: number; still: boolean};

const resting: Motion = {moving: false};

const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;

const movingTo = (from: number, to: number): Motion => from === to ? resting : {moving: true, height: to, still: false};

export const MeasuredPanel: FC<PropsWithChildren<{open: boolean; namedBy: string}>> = ({open, namedBy, children}) => {
  const panel = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(open);
  const [motion, setMotion] = useState<Motion>(resting);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (open === shown || !measured) return;
    setShown(open);
    if (!moves(measured)) return;
    setMotion(now => now.moving
      ? movingTo(now.height, open ? textHeight(measured) : 0)
      : {moving: true, height: open ? 0 : textHeight(measured), still: true});
  }, [open, shown]);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (!motion.moving || !motion.still || !measured) return;
    void measured.offsetHeight;
    setMotion(movingTo(motion.height, open ? textHeight(measured) : 0));
  }, [motion, open]);

  const settled = ({target, currentTarget, propertyName}: TransitionEvent<HTMLElement>): void => {
    if (target === currentTarget && propertyName === 'height') setMotion(resting);
  };

  return <section ref={panel} aria-labelledby={namedBy}
    className={classNames('info-measured', motion.moving && 'sized', motion.moving && motion.still && 'unmoving')}
    style={motion.moving ? {'--measured-height': `${motion.height}px`} : undefined}
    onTransitionEnd={settled}>
    {children}
  </section>;
};
