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
    top: 'The panel holds to the window’s top edge.',
    middle: 'The panel sits in the window’s middle.',
    bottom: 'The panel holds to the window’s bottom edge.'
  },
  align: {
    left: 'The panel holds to the window’s left edge.',
    center: 'The browser centres the panel across the window.',
    right: 'The panel holds to the window’s right edge.'
  },
  enter: {
    above: 'A new banner slides in from above the window’s top edge.',
    below: 'A new banner slides in from below the window’s bottom edge.',
    left: 'A new banner slides in from past the window’s left edge.',
    right: 'A new banner slides in from past the window’s right edge.'
  },
  stack: {
    down: 'Each new banner goes below the ones already up.',
    up: 'Each new banner goes above the ones already up.',
    left: 'The stack grows leftward, with the newest banner at the left.',
    right: 'The stack grows rightward, with the newest banner at the right.'
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
        reading={<>
          <span className="when-motion-allowed">{copy.enter[enter]}</span>{' '}
          <span className="when-less-motion">If your system asks for less motion, a new banner appears in place, whichever entrance you choose.</span>
        </>}/>
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
    <p className="caption">
      <code>{`?side=${side}&align=${align}&enter=${enter}&stack=${stack}`}</code>
    </p>
  </section>;
