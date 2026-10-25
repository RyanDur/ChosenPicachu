import {FC} from 'react';
import {Codes, Says, Snippet, Step, Words} from '../../../Recipe';
import {Term} from '../Term';
import {unit} from '../../../Recipe/carve';
import {crossingSource} from './sources';
import {CrossingFigure} from '../CrossingFigure';

export const InnerHalf: FC = () =>
  <Step title="A swap counts once the pointer is a quarter of the way into a neighbor">
    <Words want="Swap at the first touch of a neighbor and the order flickers: at the boundary, every pixel of movement flips it back and forth.">
      <Says>Nothing has to be measured ahead of time. The browser fires dragover on whatever the pointer is over, so the
        event’s own target is the neighbor, and the neighbor’s bounding box, the rectangle the browser reports for an
        element’s place and size, is the space to cross. A <Term word="crossing">crossing</Term> counts only once the pointer is past the neighbor’s outer quarter.</Says>
      <CrossingFigure/>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(crossingSource, 'export const crossed')
      ]}/>
    </Codes>
  </Step>;
