import {FC, PropsWithChildren, TransitionEvent, useLayoutEffect, useRef, useState} from 'react';
import {classNames} from '@components/class-names';

type Motion = {kind: 'resting'} | {kind: 'pinned'; height: number} | {kind: 'moving'; height: number};

const resting: Motion = {kind: 'resting'};

const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;

const movingTo = (from: number, to: number): Motion => from === to ? resting : {kind: 'moving', height: to};

const pressed = (now: Motion, open: boolean, text: number): Motion => now.kind === 'resting'
  ? {kind: 'pinned', height: open ? 0 : text}
  : movingTo(now.height, open ? text : 0);

export const MeasuredPanel: FC<PropsWithChildren<{open: boolean; namedBy: string}>> = ({open, namedBy, children}) => {
  const panel = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(open);
  const [motion, setMotion] = useState<Motion>(resting);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (open === shown || !measured) return;
    setShown(open);
    if (!moves(measured)) return;
    const text = textHeight(measured);
    setMotion(now => pressed(now, open, text));
  }, [open, shown]);

  useLayoutEffect(() => {
    if (motion.kind !== 'pinned' || !panel.current) return;
    void panel.current.offsetHeight;
    setMotion(movingTo(motion.height, open ? textHeight(panel.current) : 0));
  }, [motion, open]);

  const settled = ({target, currentTarget, propertyName}: TransitionEvent<HTMLElement>): void => {
    if (target === currentTarget && propertyName === 'height') setMotion(resting);
  };

  return <section ref={panel} aria-labelledby={namedBy}
    className={classNames('info-measured', motion.kind !== 'resting' && 'sized', motion.kind === 'pinned' && 'unmoving')}
    style={motion.kind === 'resting' ? undefined : {'--measured-height': `${motion.height}px`}}
    onTransitionEnd={settled}>
    {children}
  </section>;
};
