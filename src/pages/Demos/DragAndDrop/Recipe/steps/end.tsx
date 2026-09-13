import {Codes, Says, Snippet, Step, Words, aside} from '../../../Recipe';

export const roadEnd =
  <Step title="Know where the road ends">
    <Words want="Some pixels on this road are never yours: the snapshot, the cursor, the cancel. And the keyboard never gets a session at all.">
      <Says>The drag image is a bitmap taken at dragstart, so it cannot be animated and cannot
        be made opaque on macOS; the cursor belongs to the platform; on macOS even the cancel is
        the platform’s animation to run; and drag-and-drop itself never answers the keyboard:
        the arrows on the grips work because they change the order directly, without the
        API. When those pixels matter, build the drag from pointer events instead; the Tables
        demo walks that road.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        aside('// no API exists for these pixels; when they matter,'),
        aside('// take the pointer road')
      ]}/>
    </Codes>
  </Step>;
