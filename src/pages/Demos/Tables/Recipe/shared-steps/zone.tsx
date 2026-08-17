import {Codes, Mdn, Reveal, Says, Snippet, Step, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {SlotsFigure} from '../SlotsFigure';
import {Term} from '../Term';
import {gap, surveySource} from './sources';

export const deadZone =
  <Step title="Find the neighbour under the pointer, with a dead zone">
    <Words want="A drift along a boundary must not chatter the order under the hand.">
      <Says>Where the pointer is, in table terms, should be arithmetic on the <Term word="survey">survey</Term>,
        not <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn> under a moving
        hand. And a plain boundary fails: swap a wide column past a narrow one at first touch,
        and the new boundary lands under the resting pointer, ready to swap straight back. The
        cure is hysteresis: a crossing has to earn some dead ground before it counts.</Says>
    </Words>
    <Reveal>
      <Says>This step is JavaScript alone. Position is a walk over cumulative column widths. A
        neighbour only yields once the pointer reaches its inner half; the outer quarter is dead
        ground, without which the reorder oscillates when a wide column passes a narrow one.
        After a swap the pointer sits over the carried column itself, a no-op, so reversing
        means deliberately reaching the neighbour’s inner half again. Hysteresis, for free,
        from geometry. The decision lives in struckPast, one function with no axis in it; the vertical
        turn will reuse it unchanged.</Says>
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
