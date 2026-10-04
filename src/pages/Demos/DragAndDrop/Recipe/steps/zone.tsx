import {Codes, Says, Snippet, Step, Words} from '../../../Recipe';
import {Term} from '../Term';
import {unit} from '../../../Recipe/carve';
import {crossingSource} from './sources';
import {CrossingFigure} from '../CrossingFigure';

export const innerHalf =
  <Step title="A swap counts once the pointer is a quarter of the way into a neighbour">
    <Words want="Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.">
      <Says>Nothing has to be measured ahead of time on this road: the platform fires dragover on whatever the
        pointer is really over, so the event’s own target is the neighbour, and its bounding box, the rectangle the
        browser reports for an element’s place and size, is the slot. A <Term word="crossing">crossing</Term> only
        counts once the pointer is past the neighbour’s outer quarter; inside that quarter nothing moves, and an item
        already sliding cannot be overtaken.</Says>
      <CrossingFigure/>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(crossingSource, 'export const crossed')
      ]}/>
    </Codes>
  </Step>;
