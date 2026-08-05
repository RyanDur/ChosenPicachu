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

const paceReadings: Record<Pace, string> = {
  eager: 'Neighbours swap the moment you drag past them, so the order is already settled when you let go.',
  lazy: 'The table holds its shape while you drag and commits the new order on drop.'
};

const originReadings: Record<Origin, string> = {
  keep: 'The lifted row or column stays where it was, so you can see the gap it will leave.',
  hide: 'The lifted row or column blanks out at its origin; only the ghost under your pointer reads as real.'
};

const motionReadings: Record<Motion, string> = {
  animated: 'The swap itself is instant; displaced cells slide to their new seats.',
  static: 'Reorders apply in a single frame; cells cut to their new seats.'
};

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Controls: FC<Props> = ({pace, origin, motion, onPace, onOrigin, onMotion}) =>
  <section aria-label="table controls" className="table-controls">
    <article className="control">
      <span className="axis">pace</span>
      <PillGlider label="pace"
                  name="table-pace"
                  options={[
                    {display: 'Eager', value: 'eager'},
                    {display: 'Lazy', value: 'lazy'}
                  ]}
                  chosen={pace}
                  onChoose={onPace}/>
      <p className="reading">{paceReadings[pace]}</p>
    </article>
    <article className="control">
      <span className="axis">origin</span>
      <PillGlider label="origin"
                  name="table-origin"
                  options={[
                    {display: 'Keep', value: 'keep'},
                    {display: 'Hide', value: 'hide'}
                  ]}
                  chosen={origin}
                  onChoose={onOrigin}/>
      <p className="reading">{originReadings[origin]}</p>
    </article>
    <article className="control">
      <span className="axis">motion</span>
      <PillGlider label="motion"
                  name="table-motion"
                  options={[
                    {display: 'Animate', value: 'animated'},
                    {display: 'Static', value: 'static'}
                  ]}
                  chosen={motion}
                  onChoose={onMotion}/>
      <p className="reading">{motionReadings[motion]}</p>
    </article>
    <p className="readout">
      <code>{`<DragSortableTable dragStyle="${styled(pace, origin)}" animated={${String(motion === 'animated')}}/>`}</code>
    </p>
  </section>;
