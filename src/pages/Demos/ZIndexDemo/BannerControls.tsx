import {FC} from 'react';
import {Align, Entrance, Side, Stack} from '@banners';
import {DialGroup, DialRow} from '../Controls';

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
    center: 'The browser centers the panel across the window.',
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

export const BannerControls: FC<BannerControlsProps> = ({
  side, align, enter, stack, onSideChosen, onAlignChosen, onEnterChosen, onStackChosen
}) =>
  <section aria-labelledby="banner-controls-heading" className="controls">
    <h3 id="banner-controls-heading" className="off-screen">banner controls</h3>
    <DialGroup>
      <DialRow label="side"
        name="banner-side"
        choices={[
          {words: 'Top', value: 'top'},
          {words: 'Middle', value: 'middle'},
          {words: 'Bottom', value: 'bottom'}
        ]}
        chosen={side}
        onChosen={onSideChosen}
        reading={copy.side[side]}/>
      <DialRow label="align"
        name="banner-align"
        choices={[
          {words: 'Left', value: 'left'},
          {words: 'Center', value: 'center'},
          {words: 'Right', value: 'right'}
        ]}
        chosen={align}
        onChosen={onAlignChosen}
        reading={copy.align[align]}/>
      <DialRow label="entrance"
        name="banner-entrance"
        choices={[
          {words: 'Above', value: 'above'},
          {words: 'Below', value: 'below'},
          {words: 'Left', value: 'left'},
          {words: 'Right', value: 'right'}
        ]}
        chosen={enter}
        onChosen={onEnterChosen}
        reading={<>
          <span className="when-motion-allowed">{copy.enter[enter]}</span>{' '}
          <span className="when-less-motion">If your system asks for less motion, a new banner appears in place,
            whichever entrance you choose.</span>
        </>}/>
      <DialRow label="stack"
        name="banner-stack"
        choices={[
          {words: 'Down', value: 'down'},
          {words: 'Up', value: 'up'},
          {words: 'Left', value: 'left'},
          {words: 'Right', value: 'right'}
        ]}
        chosen={stack}
        onChosen={onStackChosen}
        reading={copy.stack[stack]}/>
    </DialGroup>
    <p className="caption">
      <code className="monospaced">{`?side=${side}&align=${align}&enter=${enter}&stack=${stack}`}</code>
    </p>
  </section>;
