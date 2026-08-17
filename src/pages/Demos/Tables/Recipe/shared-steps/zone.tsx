import {Codes, Mdn, Reveal, Says, Snippet, Step, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {SlotsFigure} from '../SlotsFigure';
import {gap, surveySource} from './sources';

export const deadZone =
  <Step title="Find the neighbour under the pointer, with a dead zone">
    <Words want="A drift along a boundary must not chatter the order under the hand.">
      <Says>Where the pointer is, in table terms, should be arithmetic on the survey, not
        elementFromPoint under a moving hand. And a naive boundary bites: swap a wide column
        past a narrow one at first touch, and the new boundary lands under the resting pointer,
        armed to swap straight back. We would look for hysteresis: some dead ground a crossing
        has to earn before it counts.</Says>
    </Words>
    <Reveal>
      <Says>This step is JavaScript alone, on purpose: where the pointer is, in table terms,
        is a walk over cumulative column widths: arithmetic on the survey,
        never <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn>. A{' '}
        neighbour only yields once the pointer reaches its inner half: the outer quarter is a
        dead zone, without which the reorder oscillates when a wide column passes a narrow one.
        After a swap the pointer sits over the carried column itself, a no-op, so reversing
        means deliberately reaching the neighbour’s inner half again. Hysteresis, for free,
        from geometry. The ruling itself is struckPast, one function with no axis in it; the
        vertical turn will reuse it unchanged.</Says>
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
