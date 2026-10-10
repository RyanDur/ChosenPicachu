import {Codes, Says, Snippet, Step, Words, aside} from '../../../Recipe';

export const roadEnd =
  <Step title="What drag and drop cannot give you">
    <Words want="You cannot change how the browser draws its drag image, its cursor or its cancel, and the keyboard gets no drag at all.">
      <Says>The drag image is a picture taken once at dragstart, so it cannot be animated, and on macOS it cannot be
        made opaque. The cursor is the browser’s. The cancel is the browser’s animation; on macOS it is the system’s, and
        nothing in the page can shorten it. And drag and drop never answers the keyboard: the arrows on the grips work
        because they change the order directly, without the drag API. When those pixels matter, build the drag from
        pointer events instead, which is what the Tables demo does.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        aside('// no API exists for these pixels; when they matter,'),
        aside('// take the pointer road')
      ]}/>
    </Codes>
  </Step>;
