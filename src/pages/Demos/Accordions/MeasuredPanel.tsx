import {FC, PropsWithChildren, TransitionEvent, useLayoutEffect, useReducer, useRef} from 'react';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useOpenFolds} from './useOpenFolds';

type Motion = {kind: 'resting'} | {kind: 'pinned'; height: number} | {kind: 'moving'; height: number};

type Panel = {shown: boolean; motion: Motion};

type Pressed = {
  readonly type: 'pressed';
  readonly open: boolean;
  readonly moves: boolean;
  readonly text: number;
  readonly stands: number;
};
type Pinned = {readonly type: 'pinned'; readonly end: number};
type Settled = {readonly type: 'settled'};
type PanelChange = Pressed | Pinned | Settled;

const resting: Motion = {kind: 'resting'};

const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number =>
  maybe(panel.firstElementChild).map(text => text.getBoundingClientRect().height).orElse(0);

const standing = (panel: HTMLElement): number => panel.getBoundingClientRect().height;

const movingTo = (from: number, to: number): Motion => from === to ? resting : {kind: 'moving', height: to};

const motionOnPress = (now: Motion, open: boolean, text: number, stands: number): Motion => now.kind === 'resting'
  ? {kind: 'pinned', height: open ? 0 : text}
  : movingTo(stands, open ? text : 0);

const panelChange = {
  pressed: (open: boolean, panel: HTMLElement): Pressed =>
    ({type: 'pressed', open, moves: moves(panel), text: textHeight(panel), stands: standing(panel)}),
  pinned: (end: number): Pinned => ({type: 'pinned', end}),
  settled: (): Settled => ({type: 'settled'})
};

const nextPanel = (panel: Panel, change: PanelChange): Panel => {
  switch (change.type) {
    case 'pressed':
      return {
        shown: change.open,
        motion: change.moves ? motionOnPress(panel.motion, change.open, change.text, change.stands) : panel.motion
      };
    case 'pinned':
      return panel.motion.kind === 'pinned' ? {...panel, motion: movingTo(panel.motion.height, change.end)} : panel;
    case 'settled':
      return {...panel, motion: resting};
  }
};

export const MeasuredPanel: FC<PropsWithChildren<{namedBy: string}>> = ({namedBy, children}) => {
  const panel = useRef<HTMLElement>(null);
  const open = useOpenFolds().includes(namedBy);
  const [{shown, motion}, dispatch] = useReducer(nextPanel, {shown: open, motion: resting});

  useLayoutEffect(() => {
    const measured = panel.current;
    if (open !== shown && measured) {
      dispatch(panelChange.pressed(open, measured));
    }
  }, [open, shown]);

  useLayoutEffect(() => {
    const measured = panel.current;
    if (motion.kind === 'pinned' && measured) {
      void measured.offsetHeight;
      dispatch(panelChange.pinned(open ? textHeight(measured) : 0));
    }
  }, [motion, open]);

  const settled = ({target, currentTarget, propertyName}: TransitionEvent<HTMLElement>): void => {
    if (target === currentTarget && propertyName === 'height') dispatch(panelChange.settled());
  };

  return <section ref={panel} aria-labelledby={namedBy}
    className={classNames('info-measured', motion.kind !== 'resting' && 'sized', motion.kind === 'pinned' && 'unmoving')}
    style={motion.kind === 'resting' ? undefined : {'--measured-height': `${motion.height}px`}}
    onTransitionEnd={settled}>
    {children}
  </section>;
};
