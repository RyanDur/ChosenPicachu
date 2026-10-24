import {FC, ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, sortableCss} from './sources';

const shareMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    plain('<table><thead><tr><th scope="col">window</th> ...'),
    plain('<button className="grip" tabIndex={0} aria-label="move row 2"><Handle/></button>'),
    plain('<button className="resize-handle" tabIndex={0} aria-label="resize trades, 24%"/>')
  ]}/>,
  vanilla: <Snippet label="HTML" lines={[
    plain('<th scope="col" class="cell window header-cell">'),
    plain('<row-grip><button type="button" tabindex="0" class="grip grabbable" aria-label="move row 2">…</button></row-grip>'),
    plain('<resize-handle><button type="button" tabindex="0" class="resize-handle" aria-label="resize trades"></button></resize-handle>')
  ]}/>
};

export const CssShare: FC<{world: World}> = ({world}) =>
  <Step title="Let CSS carry its share">
    <Words want="Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s own behaviour comes first, and most of it is a declaration in the stylesheet, not code.">
      <Says>Your first pass writes no behaviour: the stylesheet already covers most of
        this. <Mdn path="Web/CSS/cursor">cursor</Mdn> offers the open hand and the closed
        fist, <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none lets pointer events drag
        on a touchscreen instead of scrolling it,
        and <Mdn path="Web/CSS/user-select">user-select</Mdn>: none keeps a fast drag from
        sweeping selections. Anything the pointer or the keyboard must find should be a
        real <Mdn path="Web/HTML/Element/button">button</Mdn>, which comes named and
        focusable.</Says>
    </Words>
    <Reveal>
      <Says>The markup stays plain HTML, a real table with real headers. The row grip is a
        button that will reorder rows from the arrow keys without a line of drag code, and the
        resize handle is a button that announces itself by name, and its <Term word="share">share</Term> once the ledger
        exists. Each button writes a tabindex it would not need anywhere but Safari, whose
        plain Tab skips a bare button; the keyboard track says why.</Says>
      {world === 'vanilla' && <Says>In the vanilla build the grip’s button and the handle’s button are each wrapped in a
        custom element, <code>row-grip</code> and <code>resize-handle</code>: a tag of the page’s own, registered with the
        browser, that runs a function of its own when the browser connects it to the page. Each finds its button on connect
        and attaches the behaviour to it.</Says>}
      <Says>JavaScript is left holding only what CSS cannot: one measurement, some arithmetic,
        and the order.</Says>
      <Codes>
        {shareMarkup[world]}
        <Snippet label="CSS" lines={[
          ...unit(sortableCss, '.grabbable {'), gap,
          ...unit(sortableCss, '.sortable {')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
