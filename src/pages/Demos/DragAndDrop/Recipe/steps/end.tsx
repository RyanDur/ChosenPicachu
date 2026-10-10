import {Codes, Says, Snippet, Step, Words, aside} from '../../../Recipe';

export const roadEnd =
  <Step title="What drag and drop cannot give you">
    <Words want="Three things stay the browser’s: the drag image, the cursor and the cancel. And the keyboard gets no drag at all.">
      <Says>The drag image is a picture taken once at dragstart, so it cannot be animated, and on macOS it cannot be
        made opaque. The cursor is the browser’s. On macOS the cancel is the browser’s animation too. And drag and drop
        never answers the keyboard: the arrows on the grips work because they change the order directly, without the
        drag API. When those pixels matter, build the drag from pointer events instead, which is what the Tables demo
        does.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        aside('// no API exists for these pixels; when they matter,'),
        aside('// take the pointer road')
      ]}/>
    </Codes>
  </Step>;
