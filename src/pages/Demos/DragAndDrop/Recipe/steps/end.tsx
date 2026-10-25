import {FC} from 'react';
import {Link} from 'react-router';
import {DemoTopics, demoAddress} from '../../../types';
import {Codes, Says, Snippet, Step, Words, aside} from '../../../Recipe';

export const RoadEnd: FC = () =>
  <Step title="What drag and drop cannot give you">
    <Words want="You cannot change how the browser draws its drag image, its cursor or its cancel.">
      <Says>The drag image is a picture taken once at dragstart, so it cannot be animated, and on macOS it cannot be
        made opaque. The cursor is the browser’s. The cancel is the browser’s animation; on macOS it is the system’s, and
        nothing in the page can shorten it. When those pixels matter, build the drag from
        pointer events instead, which is what the{' '}
      <Link className="signpost" to={demoAddress(DemoTopics.tables)}>Tables demo</Link> does.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        aside('// no API exists for these pixels; when they matter,'),
        aside('// build the drag from pointer events')
      ]}/>
    </Codes>
  </Step>;
