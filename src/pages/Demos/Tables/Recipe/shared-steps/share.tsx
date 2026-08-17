import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {gap, sortableCss} from './sources';

const shareMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    plain('<table><thead><tr><th scope="col">window</th> ...'),
    plain('<button className="grip" aria-label="move row 2"><Handle/></button>'),
    plain('<button className="resize-handle" aria-label="resize trades, 24%"/>')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    plain('<th scope="col" class="cell window header-cell clipped">'),
    plain('<button type="button" class="grip grabbable" aria-label="move row 2">'),
    plain('<button type="button" class="resize-handle" aria-label="resize trades">')
  ]}/>
};

export const cssShare = (world: World): ReactNode =>
  <Step title="Let CSS carry its share">
    <Words want="Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s manners come first, and most of them are declarations, not code.">
      <Says>Our first pass writes no behavior: the stylesheet already covers most of
        this. <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the open hand and the closed
        fist, <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets pointer events drag
        on a touchscreen instead of scrolling it,
        and <Mdn path="Web/CSS/user-select">user-select</Mdn>: none keeps a fast drag from
        sweeping selections. Anything the hand or the keyboard must find should be a
        real <Mdn path="Web/HTML/Element/button">button</Mdn>, which arrives named and
        focusable.</Says>
    </Words>
    <Reveal>
      <Says>The markup stays honest HTML, a real table with real headers. The row grip is a
        button that will reorder rows from the arrow keys without a line of drag code, and the
        resize handle is a button that announces itself by name, and its share once the ledger
        exists.</Says>
      <Says>JavaScript is left holding only what CSS cannot: one measurement, some arithmetic,
        and the order.</Says>
      <Codes>
        {shareMarkup[world]}
        <Snippet label="CSS" lines={[
          ...unit(sortableCss, '.grabbable {'), gap,
          ...unit(sortableCss, '.sortable {')
        ]}/>
        <Snippet label="TS" lines={[
          aside('// one measurement, slot arithmetic, and the order; nothing else')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
