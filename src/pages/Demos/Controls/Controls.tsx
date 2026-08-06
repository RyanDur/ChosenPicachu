import {FC} from 'react';
import * as D from 'schemawax';
import {DragStyle} from '@components/DragSortableTable';
import {PillGlider} from '@components/PillGlider';
import './Controls.css';

export type Pace = 'eager' | 'lazy';
export type Origin = 'keep' | 'hide';
export type Motion = 'animated' | 'static';

export const paceParam: D.Decoder<Pace> = D.literalUnion('eager', 'lazy');
export const originParam: D.Decoder<Origin> = D.literalUnion('keep', 'hide');
export const motionParam: D.Decoder<Motion> = D.literalUnion('animated', 'static');

const styles: Record<Origin, Record<Pace, DragStyle>> = {
  keep: {eager: 'eager-move', lazy: 'lazy-move'},
  hide: {eager: 'hide-eager-move', lazy: 'hide-lazy-move'}
};

export const styled = (pace: Pace, origin: Origin): DragStyle => styles[origin][pace];

export type Copy = {
  kind: string;
  component: Record<Motion, string>;
  pace: Record<Pace, string>;
  origin: Record<Origin, string>;
  motion: Record<Motion, string>;
};

export type ControlsProps = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Controls: FC<ControlsProps & {copy: Copy}> = ({copy, pace, origin, motion, onPace, onOrigin, onMotion}) =>
  <section aria-label={`${copy.kind} controls`} className="controls">
    <article className="control">
      <span className="axis">pace</span>
      <PillGlider label="pace"
                  name={`${copy.kind}-pace`}
                  options={[
                    {display: 'Eager', value: 'eager'},
                    {display: 'Lazy', value: 'lazy'}
                  ]}
                  chosen={pace}
                  onChoose={onPace}/>
      <p className="reading">{copy.pace[pace]}</p>
    </article>
    <article className="control">
      <span className="axis">origin</span>
      <PillGlider label="origin"
                  name={`${copy.kind}-origin`}
                  options={[
                    {display: 'Keep', value: 'keep'},
                    {display: 'Hide', value: 'hide'}
                  ]}
                  chosen={origin}
                  onChoose={onOrigin}/>
      <p className="reading">{copy.origin[origin]}</p>
    </article>
    <article className="control">
      <span className="axis">motion</span>
      <PillGlider label="motion"
                  name={`${copy.kind}-motion`}
                  options={[
                    {display: 'Animate', value: 'animated'},
                    {display: 'Static', value: 'static'}
                  ]}
                  chosen={motion}
                  onChoose={onMotion}/>
      <p className="reading">{copy.motion[motion]}</p>
    </article>
    <p className="readout">
      <code>{`<${copy.component[motion]} dragStyle="${styled(pace, origin)}"/>`}</code>
    </p>
  </section>;
