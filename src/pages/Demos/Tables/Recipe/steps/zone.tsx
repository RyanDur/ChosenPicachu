import {Codes, Mdn, Reveal, Says, Snippet, Step, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {SlotsFigure} from '../SlotsFigure';
import {Term} from '../Term';
import {gap, surveySource} from './sources';

export const deadZone =
  <Step title="Find the neighbour under the pointer, with a dead zone" id="step-dead-zone">
    <Words want="A drift along a boundary must not chatter the order under the hand.">
      <Says>Where the pointer is, in table terms, should be arithmetic on the <Term word="survey">survey</Term>,
        not <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn> under a moving
        hand. And a plain boundary fails: swap a wide column past a narrow one at first touch,
        and the new boundary lands under the resting pointer, ready to swap straight back. The
        cure is hysteresis: a crossing has to earn some dead ground before it counts.</Says>
    </Words>
    <Reveal>
      <Says>This step is JavaScript alone. To find the column under the pointer, the code adds the columns’ widths from
        the left until the total passes the pointer’s x.</Says>
      <Says>That column gives way only once the pointer is past a dead zone on the side it came in by. The dead zone is a
        quarter of that column’s width, or half the difference between it and the carried column when that is more,
        which is the case when a narrow column passes a much wider one.</Says>
      <Says>After a switch the pointer is over the carried column itself, which does nothing. Going back means crossing
        the neighbour’s dead zone again.</Says>
      <Says>The decision is in struckPast, one function that doesn’t know which axis it is on. The step for rows uses it
        unchanged.</Says>
      <SlotsFigure/>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(surveySource, 'const deadZone = '), gap,
          ...unit(surveySource, 'const struckPast = '), gap,
          ...unit(surveySource, 'export const columnUnder')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
