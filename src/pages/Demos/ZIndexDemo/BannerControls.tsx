import {FC} from 'react';
import {Align, Entrance, Side, Stack} from '@components/Banners/params';
import {DialGroup, DialRow} from '../Controls/DialRow';

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
  onSideChosen: (side: Side) => void;
  onAlignChosen: (align: Align) => void;
  onEnterChosen: (enter: Entrance) => void;
  onStackChosen: (stack: Stack) => void;
};

export const BannerControls: FC<BannerControlsProps> = ({side, align, enter, stack, onSideChosen, onAlignChosen, onEnterChosen, onStackChosen}) =>
  <section aria-labelledby="banner-controls-heading" className="controls">
    <h3 id="banner-controls-heading" className="off-screen">banner controls</h3>
    <DialGroup>
      <DialRow label="side"
        name="banner-side"
        options={[
          {display: 'Top', value: 'top'},
          {display: 'Middle', value: 'middle'},
          {display: 'Bottom', value: 'bottom'}
        ]}
        chosen={side}
        onChosen={onSideChosen}
        reading={copy.side[side]}/>
      <DialRow label="align"
        name="banner-align"
        options={[
          {display: 'Left', value: 'left'},
          {display: 'Center', value: 'center'},
          {display: 'Right', value: 'right'}
        ]}
        chosen={align}
        onChosen={onAlignChosen}
        reading={copy.align[align]}/>
      <DialRow label="entrance"
        name="banner-entrance"
        options={[
          {display: 'Above', value: 'above'},
          {display: 'Below', value: 'below'},
          {display: 'Left', value: 'left'},
          {display: 'Right', value: 'right'}
        ]}
        chosen={enter}
        onChosen={onEnterChosen}
        reading={copy.enter[enter]}/>
      <DialRow label="stack"
        name="banner-stack"
        options={[
          {display: 'Down', value: 'down'},
          {display: 'Up', value: 'up'},
          {display: 'Left', value: 'left'},
          {display: 'Right', value: 'right'}
        ]}
        chosen={stack}
        onChosen={onStackChosen}
        reading={copy.stack[stack]}/>
    </DialGroup>
    <p className="readout caption">
      <code>{`?side=${side}&align=${align}&enter=${enter}&stack=${stack}`}</code>
    </p>
  </section>;
