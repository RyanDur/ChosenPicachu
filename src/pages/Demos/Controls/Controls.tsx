import {FC, PropsWithChildren, useState} from 'react';
import * as schema from 'schemawax';
import {DragStyle} from '@components/DragSortableTable';
import {PillGlider} from '@components/PillGlider';
import './Controls.css';

const roomy = (): boolean => {
  const phone = getComputedStyle(document.documentElement).getPropertyValue('--phone').trim();
  return phone === '' || !window.matchMedia(`(max-width: ${phone}), (max-height: ${phone})`).matches;
};

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
  kind: string;
  readout: (pace: Pace, origin: Origin, motion: Motion) => string;
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

export const Controls: FC<PropsWithChildren<ControlsProps & {copy: Copy}>> = ({copy, pace, origin, motion, onPace, onOrigin, onMotion, children}) => {
  const [startsOpen] = useState(roomy);
  return <details className="controls-fold" open={startsOpen}>
  <summary className="prompt">
    settings
    <code className="readout caption">{copy.readout(pace, origin, motion)}</code>
  </summary>
  <section aria-label={`${copy.kind} controls`} className="controls">
    <article className="control">
      <span className="axis caption uppercase">pace</span>
      <PillGlider label="pace"
                  name={`${copy.kind}-pace`}
                  options={[
                    {display: 'Eager', value: 'eager'},
                    {display: 'Lazy', value: 'lazy'}
                  ]}
                  chosen={pace}
                  onChoose={onPace}/>
      <p className="reading paragraph">{copy.pace[pace]}</p>
    </article>
    <article className="control">
      <span className="axis caption uppercase">origin</span>
      <PillGlider label="origin"
                  name={`${copy.kind}-origin`}
                  options={[
                    {display: 'Keep', value: 'keep'},
                    {display: 'Hide', value: 'hide'}
                  ]}
                  chosen={origin}
                  onChoose={onOrigin}/>
      <p className="reading paragraph">{copy.origin[origin]}</p>
    </article>
    <article className="control">
      <span className="axis caption uppercase">motion</span>
      <PillGlider label="motion"
                  name={`${copy.kind}-motion`}
                  options={[
                    {display: 'Animate', value: 'animated'},
                    {display: 'Static', value: 'static'}
                  ]}
                  chosen={motion}
                  onChoose={onMotion}/>
      <p className="reading paragraph">{copy.motion[motion]}</p>
    </article>
    {children}
  </section>
  </details>;
};
