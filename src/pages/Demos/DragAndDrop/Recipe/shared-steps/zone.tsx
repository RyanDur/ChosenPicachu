import {Codes, Says, Snippet, Step, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {crossingSource} from './sources';

export const innerHalf =
  <Step title="Find the crossing with the inner half">
    <Words want="Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.">
      <Says>There is no survey on this road: the platform fires dragover on whatever the
        pointer is really over, so the event’s own target is the neighbour and its bounding
        box is the slot. A crossing only counts once the pointer reaches the inner half; the
        outer quarter holds still, and an item already sliding cannot be overtaken.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(crossingSource, 'export const crossed')
      ]}/>
    </Codes>
  </Step>;
