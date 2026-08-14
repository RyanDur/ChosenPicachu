import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {Align, Entrance, Side, Stack} from '@components/Banners/params';
import './BannerControls.css';

type Copy = {
  side: Record<Side, string>;
  align: Record<Align, string>;
  enter: Record<Entrance, string>;
  stack: Record<Stack, string>;
};

const copy: Copy = {
  side: {
    top: 'The news stands along the top edge, read before anything else.',
    middle: 'The news stands mid-screen, in front of whatever you were doing.',
    bottom: 'The news rests along the bottom edge and waits to be noticed.'
  },
  align: {
    left: 'The stack holds to the left edge of the screen.',
    center: 'The stack centers itself on the screen.',
    right: 'The stack holds to the right edge of the screen.'
  },
  enter: {
    above: 'Arrivals drop in from beyond the top of the screen.',
    below: 'Arrivals rise from beneath the bottom of the screen.',
    left: 'Arrivals sweep in from past the left edge.',
    right: 'Arrivals sweep in from past the right edge.'
  },
  stack: {
    down: 'Each new trouble joins beneath the ones already standing.',
    up: 'Each new trouble stands on top of the pile.',
    left: 'The pile grows sideways, newest at the left.',
    right: 'The pile grows sideways, newest at the right.'
  }
};

export type BannerControlsProps = {
  side: Side;
  align: Align;
  enter: Entrance;
  stack: Stack;
  onSide: (side: Side) => void;
  onAlign: (align: Align) => void;
  onEnter: (enter: Entrance) => void;
  onStack: (stack: Stack) => void;
};

export const BannerControls: FC<BannerControlsProps> = ({side, align, enter, stack, onSide, onAlign, onEnter, onStack}) =>
  <section aria-label="banner controls" className="controls">
    <article className="control">
      <span className="axis caption uppercase">side</span>
      <PillGlider label="side"
                  name="banner-side"
                  options={[
                    {display: 'Top', value: 'top'},
                    {display: 'Middle', value: 'middle'},
                    {display: 'Bottom', value: 'bottom'}
                  ]}
                  chosen={side}
                  onChoose={onSide}/>
      <p className="reading paragraph">{copy.side[side]}</p>
    </article>
    <article className="control">
      <span className="axis caption uppercase">align</span>
      <PillGlider label="align"
                  name="banner-align"
                  options={[
                    {display: 'Left', value: 'left'},
                    {display: 'Center', value: 'center'},
                    {display: 'Right', value: 'right'}
                  ]}
                  chosen={align}
                  onChoose={onAlign}/>
      <p className="reading paragraph">{copy.align[align]}</p>
    </article>
    <article className="control">
      <span className="axis caption uppercase">entrance</span>
      <PillGlider label="entrance"
                  name="banner-entrance"
                  options={[
                    {display: 'Above', value: 'above'},
                    {display: 'Below', value: 'below'},
                    {display: 'Left', value: 'left'},
                    {display: 'Right', value: 'right'}
                  ]}
                  chosen={enter}
                  onChoose={onEnter}/>
      <p className="reading paragraph">{copy.enter[enter]}</p>
    </article>
    <article className="control">
      <span className="axis caption uppercase">stack</span>
      <PillGlider label="stack"
                  name="banner-stack"
                  options={[
                    {display: 'Down', value: 'down'},
                    {display: 'Up', value: 'up'},
                    {display: 'Left', value: 'left'},
                    {display: 'Right', value: 'right'}
                  ]}
                  chosen={stack}
                  onChoose={onStack}/>
      <p className="reading paragraph">{copy.stack[stack]}</p>
    </article>
    <p className="readout caption">
      <code>{`?side=${side}&align=${align}&enter=${enter}&stack=${stack}`}</code>
    </p>
  </section>;
