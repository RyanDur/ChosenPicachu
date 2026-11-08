import {FC} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';
import {gap} from './gap';

export const FocusLands: FC<{world: World; headerSource: Sample}> = ({world, headerSource}) =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders. First, focus needs a place to land; a plain header holds none.">
      <Says>HTML already does most of this: a button is focusable by birth,
        and a header can ask with
        a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn>. CSS draws the
        rest: a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring for the keyboard
        that pointer users never see.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The row grip is already a button, and the headers ask with a tabIndex, so Tab
          reaches every movable piece of the table in order. The focus-visible ring draws for the
          keyboard only. A shared class is a look that lives in the site’s shared style sheet and that an element wears
          by name. <code className="monospaced">focus-ringed</code> is one: the site’s ring, which every movable column
          header and every grip wears.</Says>
        : <Says>The row grip is already a button in the markup. When boot
          calls <code className="monospaced">dragSortable</code> on the table, and whenever the column order changes,
          the build marks each movable header grabbable and gives it a tabindex; the anchored edges hold the table, so
          their headers get neither. So Tab reaches every movable piece of the table in order. The focus-visible ring
          draws for the keyboard only. A shared class is a look that lives in the site’s shared style sheet and that an
          element wears by name. <code className="monospaced">focus-ringed</code> is one: the site’s ring,
          which every movable column header and every grip wears.</Says>}
      <Says>The buttons say their tab stop outright: a tabindex of zero on an element that is
        focusable by birth. That is Safari’s doing. Its plain Tab visits text fields and anything
        that writes a tabindex, and skips buttons and links unless you hold Option; every other
        browser ignores the attribute on a button. Without it a Safari user reaches every header
        and never a grip.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...carve.span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
            ...carve.span(sources.grip, '<button', '</button>'),
            lines.aside('{/* the button was focusable all along; Safari’s Tab still wants it written */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...carve.unit(sources.frameColumns, 'export const markGrips = '),
            lines.aside('// the button was focusable all along; Safari’s Tab still wants it written; JavaScript asks for the headers')
          ]}/>}
        <Snippet label="CSS" lines={[
          ...carve.unit(sources.headerCss, '.sortable .header-cell {'), gap,
          ...carve.unit(sources.surfaceCss, '.focus-ringed {')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
