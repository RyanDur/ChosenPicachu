import {FC, PropsWithChildren} from 'react';
import * as schema from 'schemawax';
import {DragStyle} from '@components/DragSortableTable';
import {Disclosure} from '@components/Disclosure';
import {roomToStandOpen} from '@components/room';
import {DialRow} from './DialRow';
import './Controls.css';

export type Pace = 'eager' | 'lazy';
export type Origin = 'keep' | 'hide';
export type Motion = 'animated' | 'static';

export const paceParam: schema.Decoder<Pace> = schema.literalUnion('eager', 'lazy');
export const originParam: schema.Decoder<Origin> = schema.literalUnion('keep', 'hide');
export const motionParam: schema.Decoder<Motion> = schema.literalUnion('animated', 'static');

const styles: Record<Origin, Record<Pace, DragStyle>> = {
  keep: {eager: 'eager-move', lazy: 'lazy-move'},
  hide: {eager: 'hide-eager-move', lazy: 'hide-lazy-move'}
};

export const styled = (pace: Pace, origin: Origin): DragStyle => styles[origin][pace];

export type Copy = {
  kind: 'list' | 'table';
  readout: (pace: Pace, origin: Origin, motion: Motion) => string;
  pace: Record<Pace, string>;
  origin: Record<Origin, string>;
  motion: Record<Motion, string>;
};

export type Dials = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
};

export type ControlsProps = Dials & {
  onPaceChosen: (pace: Pace) => void;
  onOriginChosen: (origin: Origin) => void;
  onMotionChosen: (motion: Motion) => void;
};

export const Controls: FC<PropsWithChildren<ControlsProps & {copy: Copy}>> = ({copy, pace, origin, motion, onPaceChosen, onOriginChosen, onMotionChosen, children}) => {
  const heading = `${copy.kind}-controls-heading`;
  return <Disclosure label="settings" className="demo-settings" startsOpen={roomToStandOpen}
    prompt={<>settings{' '}<code className="readout caption">{copy.readout(pace, origin, motion)}</code></>}>
    <section aria-labelledby={heading} className="controls">
      <h4 id={heading} className="off-screen">{copy.kind} controls</h4>
      <ul>
        <DialRow label="pace"
          name={`${copy.kind}-pace`}
          options={[
            {display: 'Eager', value: 'eager'},
            {display: 'Lazy', value: 'lazy'}
          ]}
          chosen={pace}
          onChosen={onPaceChosen}
          reading={copy.pace[pace]}/>
        <DialRow label="origin"
          name={`${copy.kind}-origin`}
          options={[
            {display: 'Keep', value: 'keep'},
            {display: 'Hide', value: 'hide'}
          ]}
          chosen={origin}
          onChosen={onOriginChosen}
          reading={copy.origin[origin]}/>
        <DialRow label="motion"
          name={`${copy.kind}-motion`}
          options={[
            {display: 'Animate', value: 'animated'},
            {display: 'Static', value: 'static'}
          ]}
          chosen={motion}
          onChosen={onMotionChosen}
          reading={copy.motion[motion]}/>
      </ul>
      {children}
    </section>
  </Disclosure>;
};
