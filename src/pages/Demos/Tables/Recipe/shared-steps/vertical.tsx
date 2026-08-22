import {ReactNode} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameHtml, gap, gripSource, settlesSource, surveySource} from './sources';

export const carryVertical = (world: World, tableSource: string): ReactNode =>
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
        the <Term word="seats">seats</Term> are the seating chart, the rows’ order; a row keeps its number as the seats
        shuffle. The settle is the same story: the moved row takes its new seat, and the rest
        ride along.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(gripSource, '<button', '</button>'),
            aside('{/* focusable by birth; the keyboard track will thank us */}')
          ]}/>
          : <Snippet label="HTML" lines={[
            ...span(frameHtml, '<button type="button" class="grip grabbable" aria-label="move row 1">', '</button>'),
            aside('<!-- focusable by birth; the keyboard track will thank us -->')
          ]}/>}
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(surveySource, 'export const rowUnder'), gap,
            ...unit(tableSource, 'const settleRow = ')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(surveySource, 'export const rowUnder'), gap,
            ...unit(settlesSource, 'export const animatedSettleRow'), gap,
            ...unit(settlesSource, 'export const staticSettleRow')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
