import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {Term} from '../Term';
import {sources} from './sources';

export const CarryVertical: FC<{world: World; rowSource: Sample; buildSource: Sample}> =
  ({world, rowSource, buildSource}) =>
    <Step title="Turn the carry vertical">
      <Words want="A lookback is a row: the same carry on a second axis, and the pointer needs a real thing to hold.">
        <Says>The second axis should come from substitutions, not new machinery: a real
          button for the pointer, row heights joining the <Term word="survey">survey</Term>, and the under-the-pointer
          question asked downward.</Says>
      </Words>
      <Reveal>
        <Says>Rows reuse the machinery the columns built, with three substitutions. The grip is a
          real button, so the pointer has a target and the keyboard will later get one for free. The
          survey learns row heights at lift, measured once like everything else. And rowUnder
          reports which seat sits under the pointer, columnUnder turned vertical. One more word:
          the <Term word="seats">seats</Term> are the seating chart, the rows’ order; a row keeps its key as the seats
          shuffle. The settle is the same story: the moved row takes its new seat, and the rest
          carry over.</Says>
        {world === 'react'
          ? <Says>The grip does the traveling as well as the lifting, and that is Safari’s doing.
            The grip takes the pointer at the lift; if the header cell retakes it on the first
            move, WebKit lets the grip’s capture go at once, with no button down, and the drag
            reads that loss as the drop. Chrome lets go lazily, on the next move, so it never
            shows there. The element that lifts is the element that travels, and the loss never
            fires.</Says>
          : <Says>The grip does the traveling as well as the lifting: the move, the drop and the capture loss are wired
            on the grip itself, never on the cell around it. Safari requires it: when another element takes the pointer,
            WebKit drops the grip’s capture at once, with no button down, and the drag reads that loss as the
            drop.</Says>}
        {world === 'vanilla' && <Says>In the vanilla build the grip is the button the page writes,
          marked <code className="monospaced">data-row-grip</code>. When boot
          calls <code className="monospaced">dragSortable</code> it attaches the lift, the carry and the arrow keys to
          that button, with the verbs the pace decides.</Says>}
        <Codes>
          {world === 'react'
            ? <Snippet label="HTML" lines={[
              ...carve.span(sources.grip, '<button', '</button>'),
              lines.aside('{/* focusable by birth; the keyboard track builds on it */}')
            ]}/>
            : <Snippet label="HTML" lines={[
              ...carve.span(sources.frameHtml, '<button type="button" tabindex="0" data-row-grip', '</button>this minute'),
              lines.aside('<!-- focusable by birth; the keyboard track builds on it -->')
            ]}/>}
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.unit(sources.survey, 'const rowUnder'), lines.blank,
              ...carve.unit(rowSource, 'const beside = '), lines.blank,
              ...carve.span(rowSource, 'onPointerDown={lifting.row(', 'onLostPointerCapture={has(drag) ? travel.pointer(moved(drag), release) : undefined}'),
              lines.aside('{/* the grip lifts and the grip travels; retake the pointer anywhere else and Safari drops it */}')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(sources.survey, 'const rowUnder'), lines.blank,
              ...carve.unit(buildSource, 'const rowBeside = '), lines.blank,
              ...carve.unit(sources.frameGrip, 'const gripping = '), lines.blank,
              ...carve.unit(sources.frameGrip, 'export const rowGrip = '), lines.blank,
              ...carve.unit(sources.frameParts, 'export const wireParts = '),
              lines.aside('// the grip lifts and the grip travels; retake the pointer anywhere else and Safari drops it')
            ]}/>}
        </Codes>
      </Reveal>
    </Step>;
