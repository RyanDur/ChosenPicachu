import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameGrip, frameHtml, frameParts, gap, gripSource, surveySource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const CarryVertical: FC<{world: World; rowSource: Sample; buildSrc: Sample}> = ({world, rowSource, buildSrc}) =>
  <Step title="Turn the carry vertical">
    <Words want="A window is a row: the same carry on a second axis, and the pointer needs a real thing to hold.">
      <Says>The second axis should come from substitutions, not new machinery: a real
        button for the pointer, row heights joining the <Term word="survey">survey</Term>, and the under-the-pointer question
        asked downward.</Says>
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
        ? <Says>The grip does the travelling as well as the lifting, and that is Safari’s doing.
          The grip takes the pointer at the lift; if the header cell retakes it on the first
          move, WebKit lets the grip’s capture go at once, with no button down, and the drag
          reads that loss as the drop. Chrome lets go lazily, on the next move, so it never
          shows there. The element that lifts is the element that travels, and the loss never
          fires.</Says>
        : <Says>The grip does the travelling as well as the lifting: the move, the drop and the capture loss are wired on the grip itself, never on the cell around it. Safari requires it: when another element takes the pointer, WebKit drops the grip’s capture at once, with no button down, and the drag reads that loss as the drop.</Says>}
      {world === 'vanilla' && <Says>In the vanilla build the grip is the button the page writes, marked <code>data-row-grip</code>. When boot calls <code>dragSortable</code> it attaches the lift, the carry and the arrow keys to that button, with the verbs the pace decides.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(gripSource, '<button', '</button>'),
            aside('{/* focusable by birth; the keyboard track builds on it */}')
          ]}/>
          : <Snippet label="HTML" lines={[
            ...span(frameHtml, '<button type="button" tabindex="0" data-row-grip', '</button>this minute'),
            aside('<!-- focusable by birth; the keyboard track builds on it -->')
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
            ...unit(frameGrip, 'const gripping = '), gap,
            ...unit(frameGrip, 'export const rowGrip = '), gap,
            ...unit(frameParts, 'export const wireParts = '),
            aside('// the grip lifts and the grip travels; retake the pointer anywhere else and Safari drops it')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
