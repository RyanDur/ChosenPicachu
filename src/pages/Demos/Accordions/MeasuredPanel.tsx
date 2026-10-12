import {FC, PropsWithChildren, TransitionEvent, useLayoutEffect, useRef, useState} from 'react';
import {classNames} from '@components/class-names';

type Motion = {moving: false} | {moving: true; height: number; still: boolean};

const resting: Motion = {moving: false};

const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;

const heightMoving = (panel: HTMLElement): boolean =>
  panel.getAnimations().some(motion => motion instanceof CSSTransition && motion.transitionProperty === 'height');

export const MeasuredPanel: FC<PropsWithChildren<{open: boolean}>> = ({open, children}) => {
  const panel = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(open);
  const [motion, setMotion] = useState<Motion>(resting);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (open === shown || !measured) return;
    setShown(open);
    if (!moves(measured)) return;
    setMotion(now => now.moving
      ? {moving: true, height: open ? textHeight(measured) : 0, still: false}
      : {moving: true, height: open ? 0 : textHeight(measured), still: true});
  }, [open, shown]);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (!motion.moving || !motion.still || !measured) return;
    void measured.offsetHeight;
    setMotion({moving: true, height: open ? textHeight(measured) : 0, still: false});
  }, [motion, open]);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (!motion.moving || motion.still || !measured) return;
    if (!heightMoving(measured)) setMotion(resting);
  }, [motion]);

  const settled = ({target, currentTarget, propertyName}: TransitionEvent<HTMLDivElement>): void => {
    if (target === currentTarget && propertyName === 'height') setMotion(resting);
  };

  return <div ref={panel}
    className={classNames('info-measured', motion.moving && 'sized', motion.moving && motion.still && 'unmoving')}
    style={motion.moving ? {'--measured-height': `${motion.height}px`} : undefined}
    onTransitionEnd={settled}>
    {children}
  </div>;
};
