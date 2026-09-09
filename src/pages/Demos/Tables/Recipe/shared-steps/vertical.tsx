import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameHtml, gap, gripSource, surveySource} from './sources';

export const carryVertical = (world: World, rowSource: string, buildSrc: string): ReactNode =>
  <Step title="Turn the carry vertical">
    <Words want="A window is a row: the same carry on a second axis, and the hand needs something honest to hold.">
      <Says>The second axis should be bought with substitutions, not new machinery: a real
        button for the hand, row heights joining the <Term word="survey">survey</Term>, and the under-the-pointer question
        asked downward.</Says>
    </Words>
    <Reveal>
      <Says>Rows ride the machinery the columns built, with three substitutions. The grip is a
        real button, so the hand has a target and the keyboard will later get one free. The
        survey learns row heights at lift, measured once like everything else. And rowUnder
        answers which seat sits under the pointer, columnUnder turned vertical. One more word:
        the <Term word="seats">seats</Term> are the seating chart, the rows’ order; a row keeps its key as the seats
        shuffle. The settle is the same story: the moved row takes its new seat, and the rest
        ride along.</Says>
      {world === 'react'
        ? <Says>The grip does the travelling as well as the lifting, and that is Safari’s doing.
          The grip takes the pointer at the lift; if the header cell retakes it on the first
          move, WebKit lets the grip’s capture go at once, with no button down, and the drag
          reads that loss as the drop. Chrome lets go lazily, on the next move, so it never
          shows there. The element that lifts is the element that travels, and the loss never
          fires.</Says>
        : <Says>The grip does the travelling as well as the lifting: the move, the drop and the
          capture loss are wired on the grip itself, never on the cell around it. Safari makes
          that a rule, not a taste: retake the pointer on any other element and WebKit lets the
          grip’s capture go at once, with no button down, and the drag reads that loss as the
          drop.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(gripSource, '<button', '</button>'),
            aside('{/* focusable by birth; the keyboard track will thank you */}')
          ]}/>
          : <Snippet label="HTML" lines={[
            ...span(frameHtml, '<button type="button" tabindex="0" class="grip grabbable" aria-label="move row 1">', '</button>'),
            aside('<!-- focusable by birth; the keyboard track will thank you -->')
          ]}/>}
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(surveySource, 'export const rowUnder'), gap,
            ...unit(rowSource, 'const beside = '), gap,
            ...span(rowSource, 'onPointerDown={rowLift(', 'onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}'),
            aside('{/* the grip lifts and the grip travels; retake the pointer anywhere else and Safari drops it */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(surveySource, 'export const rowUnder'), gap,
            ...unit(buildSrc, 'const rowBeside = '), gap,
            ...unit(buildSrc, 'const wireCarry = '),
            aside('// the grip lifts and the grip travels; retake the pointer anywhere else and Safari drops it')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
